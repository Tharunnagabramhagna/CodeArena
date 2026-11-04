# common.py
def make_prob(
    id, title, diff, topic, pattern, snippet, desc, in_fmt, out_fmt, constraints,
    test1_in, test1_out, test1_exp,
    test2_in, test2_out, test2_exp,
    hint1, hint2, hint3,
    method_sig, default_ret, acc_rate, subs
):
    starter = f"""class Solution {{
    public {method_sig} {{
        // Write your solution below

        return {default_ret};
    }}
}}"""
    return {
        "id": id,
        "title": title,
        "slug": id,
        "difficulty": diff,
        "topic": topic,
        "pattern": pattern,
        "snippet": snippet,
        "description": f"<p>{desc}</p>",
        "inputFormat": in_fmt,
        "outputFormat": out_fmt,
        "constraints": constraints,
        "sampleTestCases": [
            {"id": 1, "input": test1_in, "expectedOutput": test1_out, "explanation": test1_exp},
            {"id": 2, "input": test2_in, "expectedOutput": test2_out, "explanation": test2_exp}
        ],
        "hints": [hint1, hint2, hint3],
        "starterCode": starter,
        "provisionalStats": {
            "acceptanceRate": acc_rate,
            "submissionsCount": subs,
            "isProvisional": True
        }
    }

def make_problem(
    id, title, difficulty, topic, pattern, acceptance, desc, examples,
    constraints, starter_code, test_cases, hints, tags=None
):
    samples = []
    if examples:
        for idx, ex in enumerate(examples, start=1):
            samples.append({
                "id": idx,
                "input": ex.get("input", ""),
                "expectedOutput": ex.get("output", ""),
                "explanation": ex.get("explanation", "")
            })
    elif test_cases:
        for idx, tc in enumerate(test_cases[:2], start=1):
            samples.append({
                "id": idx,
                "input": tc.get("input", ""),
                "expectedOutput": tc.get("expected", ""),
                "explanation": ""
            })

    acc_clean = acceptance.replace("%", "").strip()
    try:
        acc_float = float(acc_clean)
    except:
        acc_float = 50.0

    return {
        "id": id,
        "title": title,
        "slug": id,
        "difficulty": difficulty,
        "topic": topic,
        "pattern": pattern,
        "snippet": desc[:120] + "..." if len(desc) > 120 else desc,
        "description": f"<p>{desc}</p>",
        "inputFormat": "Standard input parameters as defined in function signature.",
        "outputFormat": "Return value matching the expected method return type.",
        "constraints": constraints,
        "sampleTestCases": samples if samples else [
            {"id": 1, "input": "Standard test case", "expectedOutput": "Expected output", "explanation": ""}
        ],
        "hints": hints if len(hints) >= 3 else hints + ["Analyze edge cases and time constraints."] * (3 - len(hints)),
        "starterCode": starter_code,
        "provisionalStats": {
            "acceptanceRate": f"{acc_float:.1f}%",
            "submissionsCount": int(1000 + acc_float * 35),
            "isProvisional": True
        }
    }


