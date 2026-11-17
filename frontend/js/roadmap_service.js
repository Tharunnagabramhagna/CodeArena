/**
 * CodeArena — Guided Java Learning Roadmap Service
 * Manages local progress state, prerequisite validation, completion toggles,
 * statistical rollups, and deterministic recommended next topic computation.
 *
 * Fully client-side with safe try/catch local storage wrappers.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['CodeArenaRoadmapData'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./roadmap_data'));
    } else {
        root.CodeArenaRoadmapService = factory(root.CodeArenaRoadmapData);
    }
}(typeof self !== 'undefined' ? self : this, function (RoadmapData) {
    'use strict';

    const STORAGE_KEY = 'codearena_roadmap_progress';
    let listeners = [];
    let memoryFallbackState = null;
    let serverSynced = false;
    let serverCompletedIds = [];
    let serverUnlockedMap = {};
    let serverProblemsBySlug = {};

    function hasLiveBackend() {
        return typeof window !== 'undefined' && window.CodeArenaAPI && window.CodeArenaAPI.roadmapService;
    }

    function isAuthedLive() {
        return hasLiveBackend() && window.CodeArenaAPI.authService && window.CodeArenaAPI.authService.isAuthenticated();
    }

    function getStorage() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage;
            }
        } catch (e) {
            console.warn('[RoadmapService] LocalStorage unavailable; using memory fallback.', e);
        }
        return null;
    }

    function loadState() {
        const storage = getStorage();
        if (!storage) {
            if (!memoryFallbackState) {
                memoryFallbackState = { completedTopics: [], lastVisitedTopic: null, updatedAt: Date.now() };
            }
            return memoryFallbackState;
        }

        try {
            const raw = storage.getItem(STORAGE_KEY);
            if (!raw) {
                return { completedTopics: [], lastVisitedTopic: null, updatedAt: Date.now() };
            }
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.completedTopics)) {
                return { completedTopics: [], lastVisitedTopic: null, updatedAt: Date.now() };
            }
            return parsed;
        } catch (err) {
            console.warn('[RoadmapService] Failed to read from localStorage:', err);
            return { completedTopics: [], lastVisitedTopic: null, updatedAt: Date.now() };
        }
    }

    function saveState(state) {
        state.updatedAt = Date.now();
        const storage = getStorage();
        if (!storage) {
            memoryFallbackState = state;
            notifyListeners(state);
            return;
        }

        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.warn('[RoadmapService] Failed to write to localStorage:', err);
            memoryFallbackState = state;
        }
        notifyListeners(state);
    }

    function notifyListeners(state) {
        listeners.forEach(function (fn) {
            try {
                fn(state);
            } catch (err) {
                console.error('[RoadmapService] Listener threw error:', err);
            }
        });
    }

    const service = {
        STORAGE_KEY: STORAGE_KEY,

        /**
         * Subscribe to progress state changes
         */
        onChange: function (callback) {
            if (typeof callback === 'function') {
                listeners.push(callback);
            }
            return function unsubscribe() {
                listeners = listeners.filter(function (fn) { return fn !== callback; });
            };
        },

        /**
         * Get array of completed topic ID strings
         */
        getCompletedTopicIds: function () {
            if (serverSynced) {
                return serverCompletedIds.slice();
            }
            const state = loadState();
            return Array.from(state.completedTopics || []);
        },

        isTopicCompleted: function (topicId) {
            if (!topicId) return false;
            return this.getCompletedTopicIds().indexOf(topicId) !== -1;
        },

        isTopicUnlocked: function (topicId) {
            if (serverSynced && Object.prototype.hasOwnProperty.call(serverUnlockedMap, topicId)) {
                return Boolean(serverUnlockedMap[topicId]);
            }
            const topic = RoadmapData.getTopicById(topicId);
            if (!topic) return false;
            if (!topic.prerequisites || topic.prerequisites.length === 0) {
                return true;
            }
            const completed = this.getCompletedTopicIds();
            return topic.prerequisites.every(function (prereqId) {
                return completed.indexOf(prereqId) !== -1;
            });
        },

        getTopicProblems: function (topicId) {
            return serverProblemsBySlug[topicId] || null;
        },

        syncFromServer: async function () {
            if (!hasLiveBackend()) return null;
            try {
                if (window.CodeArenaAPI.authService && typeof window.CodeArenaAPI.authService.getCurrentUser === 'function') {
                    await window.CodeArenaAPI.authService.getCurrentUser().catch(() => null);
                }
                const res = await window.CodeArenaAPI.roadmapService.getRoadmap();
                if (res && res.success && res.data && Array.isArray(res.data.topics)) {
                    const completed = [];
                    const unlocked = {};
                    const probMap = {};
                    res.data.topics.forEach(function (t) {
                        const slug = t.slug || t.id;
                        if (!slug) return;
                        if (t.completed || String(t.status || '').toUpperCase() === 'COMPLETED') {
                            completed.push(slug);
                        }
                        unlocked[slug] = Boolean(t.unlocked);
                        if (Array.isArray(t.problems)) {
                            probMap[slug] = t.problems;
                        }
                    });
                    serverCompletedIds = completed;
                    serverUnlockedMap = unlocked;
                    serverProblemsBySlug = probMap;
                    serverSynced = true;
                    notifyListeners({ completedTopics: completed, synced: true });
                    return res.data;
                }
            } catch (e) {
                console.warn('[RoadmapService] Failed syncing from backend:', e);
            }
            return null;
        },

        getTopicStatus: function (topicId) {
            if (this.isTopicCompleted(topicId)) {
                return 'completed';
            }
            if (this.isTopicUnlocked(topicId)) {
                return 'in-progress';
            }
            return 'locked';
        },

        _requireAuthForMutation: function () {
            if (!hasLiveBackend()) return true;
            if (isAuthedLive()) return true;
            if (typeof window !== 'undefined') {
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info('Log in to save your roadmap milestone progress.');
                }
                if (window.CodeArenaAuthModal && typeof window.CodeArenaAuthModal.open === 'function') {
                    window.CodeArenaAuthModal.open('login');
                }
            }
            return false;
        },

        markTopicCompleted: async function (topicId) {
            if (!topicId) return false;
            if (hasLiveBackend()) {
                if (!this._requireAuthForMutation()) return false;
                const res = await window.CodeArenaAPI.roadmapService.updateTopicProgress(topicId, 'COMPLETED');
                if (res && res.success) {
                    await this.syncFromServer();
                    if (typeof window !== 'undefined' && window.CodeArenaToast) {
                        window.CodeArenaToast.success('Milestone marked completed.');
                    }
                    return true;
                } else {
                    if (typeof window !== 'undefined' && window.CodeArenaToast) {
                        window.CodeArenaToast.warning((res && res.message) || 'Prerequisites must be completed first.');
                    }
                    return false;
                }
            }
            const state = loadState();
            if (state.completedTopics.indexOf(topicId) === -1) {
                state.completedTopics.push(topicId);
                state.lastVisitedTopic = topicId;
                saveState(state);
            }
            return true;
        },

        unmarkTopicCompleted: async function (topicId) {
            if (!topicId) return false;
            if (hasLiveBackend()) {
                if (!this._requireAuthForMutation()) return false;
                const res = await window.CodeArenaAPI.roadmapService.updateTopicProgress(topicId, 'NOT_STARTED');
                if (res && res.success) {
                    await this.syncFromServer();
                    return true;
                } else {
                    if (typeof window !== 'undefined' && window.CodeArenaToast) {
                        window.CodeArenaToast.warning((res && res.message) || 'Unable to update milestone.');
                    }
                    return false;
                }
            }
            const state = loadState();
            const idx = state.completedTopics.indexOf(topicId);
            if (idx !== -1) {
                state.completedTopics.splice(idx, 1);
                saveState(state);
            }
            return true;
        },

        toggleTopicCompleted: async function (topicId) {
            if (this.isTopicCompleted(topicId)) {
                await this.unmarkTopicCompleted(topicId);
                return false;
            } else {
                return await this.markTopicCompleted(topicId);
            }
        },

        /**
         * Record last visited topic
         */
        setLastVisitedTopic: function (topicId) {
            const state = loadState();
            state.lastVisitedTopic = topicId;
            saveState(state);
        },

        /**
         * Get last visited topic ID
         */
        getLastVisitedTopic: function () {
            const state = loadState();
            return state.lastVisitedTopic || null;
        },

        /**
         * Reset all progress (with local storage wipe)
         */
        resetProgress: async function () {
            if (hasLiveBackend()) {
                if (!this._requireAuthForMutation()) return null;
                const res = await window.CodeArenaAPI.roadmapService.resetProgress();
                if (res && res.success) {
                    await this.syncFromServer();
                    if (typeof window !== 'undefined' && window.CodeArenaToast) {
                        window.CodeArenaToast.info('Roadmap progress reset on server.');
                    }
                    return { completedTopics: serverCompletedIds };
                } else {
                    if (typeof window !== 'undefined' && window.CodeArenaToast) {
                        window.CodeArenaToast.error((res && res.message) || 'Failed to reset roadmap progress.');
                    }
                    return null;
                }
            }
            const freshState = {
                completedTopics: [],
                lastVisitedTopic: null,
                updatedAt: Date.now()
            };
            saveState(freshState);
            return freshState;
        },

        /**
         * Calculate stats for a single level (1, 2, or 3)
         */
        getLevelStats: function (levelId) {
            const topics = RoadmapData.getTopicsByLevel(levelId);
            const total = topics.length;
            const completedIds = this.getCompletedTopicIds();
            const completed = topics.filter(function (t) {
                return completedIds.indexOf(t.id) !== -1;
            }).length;

            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            let status = 'locked';
            if (completed === total && total > 0) {
                status = 'completed';
            } else if (completed > 0 || (levelId === 1)) {
                status = 'in-progress';
            } else {
                // Check if previous level is completed or unlocked
                const prevLevelTopics = RoadmapData.getTopicsByLevel(levelId - 1);
                const prevCompleted = prevLevelTopics.filter(function (t) {
                    return completedIds.indexOf(t.id) !== -1;
                }).length;
                if (prevCompleted >= Math.ceil(prevLevelTopics.length * 0.7)) {
                    status = 'in-progress';
                }
            }

            return {
                levelId: levelId,
                total: total,
                completed: completed,
                percent: percent,
                status: status
            };
        },

        /**
         * Calculate overall roadmap progress
         */
        getOverallStats: function () {
            const allTopics = RoadmapData.getTopics();
            const total = allTopics.length;
            const completedIds = this.getCompletedTopicIds();
            const completed = completedIds.filter(function (id) {
                return allTopics.some(function (t) { return t.id === id; });
            }).length;

            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            // Determine current active level
            let currentLevel = 1;
            const l1Stats = this.getLevelStats(1);
            const l2Stats = this.getLevelStats(2);

            if (l1Stats.completed < l1Stats.total) {
                currentLevel = 1;
            } else if (l2Stats.completed < l2Stats.total) {
                currentLevel = 2;
            } else {
                currentLevel = 3;
            }

            return {
                total: total,
                completed: completed,
                percent: percent,
                currentLevel: currentLevel
            };
        },

        /**
         * Deterministic calculation of recommended next topic:
         * 1. Finds the earliest incomplete topic in order whose prerequisites are satisfied.
         * 2. If all topics are completed, returns null.
         */
        getRecommendedNextTopic: function () {
            const allTopics = RoadmapData.getTopics();
            const self = this;

            for (let i = 0; i < allTopics.length; i++) {
                const topic = allTopics[i];
                if (!self.isTopicCompleted(topic.id) && self.isTopicUnlocked(topic.id)) {
                    return topic;
                }
            }

            // Fallback: If no topic is strictly unlocked (e.g. gaps), find first incomplete
            for (let j = 0; j < allTopics.length; j++) {
                if (!self.isTopicCompleted(allTopics[j].id)) {
                    return allTopics[j];
                }
            }

            return null; // All 30 completed!
        }
    };

    return service;
}));

