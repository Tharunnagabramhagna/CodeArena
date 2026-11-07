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
            const state = loadState();
            return Array.from(state.completedTopics || []);
        },

        /**
         * Check if a specific topic is completed
         */
        isTopicCompleted: function (topicId) {
            if (!topicId) return false;
            const state = loadState();
            return (state.completedTopics || []).indexOf(topicId) !== -1;
        },

        /**
         * Check if a topic is unlocked (prerequisites satisfied)
         */
        isTopicUnlocked: function (topicId) {
            const topic = RoadmapData.getTopicById(topicId);
            if (!topic) return false;

            // Topics with no prerequisites are always unlocked
            if (!topic.prerequisites || topic.prerequisites.length === 0) {
                return true;
            }

            const completed = this.getCompletedTopicIds();
            // All prerequisites must be completed
            return topic.prerequisites.every(function (prereqId) {
                return completed.indexOf(prereqId) !== -1;
            });
        },

        /**
         * Get lifecycle status of topic: 'completed' | 'in-progress' | 'locked'
         */
        getTopicStatus: function (topicId) {
            if (this.isTopicCompleted(topicId)) {
                return 'completed';
            }
            if (this.isTopicUnlocked(topicId)) {
                return 'in-progress';
            }
            return 'locked';
        },

        /**
         * Mark topic as completed
         */
        markTopicCompleted: function (topicId) {
            if (!topicId) return;
            const state = loadState();
            if (state.completedTopics.indexOf(topicId) === -1) {
                state.completedTopics.push(topicId);
                state.lastVisitedTopic = topicId;
                saveState(state);
            }
        },

        /**
         * Unmark topic from completed
         */
        unmarkTopicCompleted: function (topicId) {
            if (!topicId) return;
            const state = loadState();
            const idx = state.completedTopics.indexOf(topicId);
            if (idx !== -1) {
                state.completedTopics.splice(idx, 1);
                saveState(state);
            }
        },

        /**
         * Toggle completion state
         */
        toggleTopicCompleted: function (topicId) {
            if (this.isTopicCompleted(topicId)) {
                this.unmarkTopicCompleted(topicId);
                return false;
            } else {
                this.markTopicCompleted(topicId);
                return true;
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
        resetProgress: function () {
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

