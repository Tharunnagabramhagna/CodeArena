/**
 * CodeArena — Basic Java Track Interactive Solution Animations (basic_animations.js)
 * Comprehensive, pedagogical visual execution animations for all 50 Basic Java Practice problems.
 * Fully integrated with solution-animation.html, solution_animation.js, and animation.css.
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Visual Component Render Helpers (H)
    // -------------------------------------------------------------------------
    const H = {
        block: (label, contentHtml) => `
            <div class="anim-visual-block">
                <span class="anim-block-label">${label}</span>
                ${contentHtml}
            </div>
        `,

        pipeline: (label, stages) => {
            const stageCards = stages.map((s, idx) => `
                <div class="anim-stage-card ${s.active ? 'stage-active' : ''} ${s.success ? 'stage-success' : ''} ${s.error ? 'stage-error' : ''}">
                    <span class="anim-reg-name">${s.label}</span>
                    <span class="anim-reg-val">${s.val}</span>
                    ${s.sub ? `<span style="font-size:0.7rem;color:#94A3B8;margin-top:2px;">${s.sub}</span>` : ''}
                </div>
                ${idx < stages.length - 1 ? '<span style="color:#64748B;font-weight:700;font-size:1.1rem;">→</span>' : ''}
            `).join('');
            return H.block(label, `<div class="anim-pipeline-flow">${stageCards}</div>`);
        },

        registers: (label, regs, note) => {
            const regCards = regs.map(r => `
                <div class="anim-reg-box ${r.active ? 'reg-active' : ''} ${r.highlight ? 'reg-highlight' : ''} ${r.done ? 'reg-done' : ''}">
                    <span class="anim-reg-name">${r.name}</span>
                    <span class="anim-reg-val">${r.val}</span>
                    ${r.type ? `<span style="font-size:0.68rem;color:#94A3B8;margin-top:2px;">${r.type}</span>` : ''}
                </div>
            `).join('');
            const noteHtml = note ? `<div style="text-align:center;font-size:0.8rem;color:#94A3B8;margin-top:8px;">${note}</div>` : '';
            return H.block(label, `<div class="anim-reg-grid">${regCards}</div>${noteHtml}`);
        },

        comp: (label, left, op, right, result, isTrue) => {
            const resultCls = isTrue ? 'color:#10B981;' : 'color:#EF4444;';
            const inner = `
                <div class="anim-comp-display">
                    <span class="anim-comp-operand">${left}</span>
                    <span class="anim-comp-op">${op}</span>
                    <span class="anim-comp-operand">${right}</span>
                    <span style="color:#64748B;">=</span>
                    <span style="font-weight:700;${resultCls}">${result}</span>
                </div>
            `;
            return H.block(label, inner);
        },

        array: (label, items, activeIndices = [], pointers = {}, note = '') => {
            const cols = items.map((val, idx) => {
                const isActive = activeIndices.includes(idx);
                const ptr = pointers[idx];
                return `
                    <div class="anim-array-col">
                        <span class="anim-pointer-pin ${ptr ? (ptr.cls || '') : 'pin-hidden'}">${ptr ? ptr.name : '·'}</span>
                        <div class="anim-array-cell ${isActive ? 'active-examined' : ''}">${val}</div>
                        <span class="anim-index-sub">idx ${idx}</span>
                    </div>
                `;
            }).join('');
            const noteHtml = note ? `<div style="text-align:center;font-size:0.8rem;color:#94A3B8;margin-top:10px;">${note}</div>` : '';
            return H.block(label, `<div class="anim-array-wrap">${cols}</div>${noteHtml}`);
        },

        pattern: (label, lines, activeLineIdx = -1) => {
            const linesHtml = lines.map((l, idx) => `
                <span class="anim-pattern-line ${idx === activeLineIdx ? 'line-active' : ''}">${l || '&nbsp;'}</span>
            `).join('');
            return H.block(label, `<div class="anim-pattern-board">${linesHtml}</div>`);
        },

        stack: (label, frames) => {
            const framesHtml = frames.map(f => `
                <div class="anim-stack-frame ${f.active ? 'frame-active' : ''} ${f.returned ? 'frame-returned' : ''}">
                    <span style="font-weight:600;">${f.call}</span>
                    <span style="color:${f.returned ? '#10B981' : '#38BDF8'};font-weight:700;">${f.val}</span>
                </div>
            `).join('');
            return H.block(label, `<div class="anim-stack-wrap">${framesHtml}</div>`);
        },

        oop: (label, cards) => {
            const cardsHtml = cards.map(c => `
                <div class="anim-oop-card">
                    <div class="anim-oop-header">${c.header}</div>
                    ${c.fields.map(f => `
                        <div class="anim-oop-field">
                            <span class="anim-oop-field-name">${f.k}:</span>
                            <span class="anim-oop-field-val">${f.v}</span>
                        </div>
                    `).join('')}
                </div>
            `).join('');
            return H.block(label, `<div class="anim-oop-display">${cardsHtml}</div>`);
        },

        tryCatch: (label, tryText, caughtText, statusText, isError) => {
            const statusColor = isError ? '#EF4444' : '#10B981';
            const inner = `
                <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin:12px auto;max-width:520px;">
                    <div style="flex:1;min-width:180px;background:rgba(30,41,59,0.7);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px;">
                        <div style="font-size:0.75rem;text-transform:uppercase;color:#94A3B8;font-weight:700;margin-bottom:6px;">try { ... }</div>
                        <div style="font-family:var(--font-mono, monospace);font-size:0.85rem;color:#F1F5F9;">${tryText}</div>
                    </div>
                    <div style="flex:1;min-width:180px;background:rgba(30,41,59,0.7);border:1px solid ${isError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'};border-radius:8px;padding:12px;">
                        <div style="font-size:0.75rem;text-transform:uppercase;color:${statusColor};font-weight:700;margin-bottom:6px;">catch (Exception e)</div>
                        <div style="font-family:var(--font-mono, monospace);font-size:0.85rem;color:${statusColor};">${caughtText}</div>
                    </div>
                </div>
                <div style="text-align:center;font-weight:700;font-size:0.9rem;color:${statusColor};margin-top:8px;">${statusText}</div>
            `;
            return H.block(label, inner);
        }
    };

    // -------------------------------------------------------------------------
    // 50 Basic Java Practice Problem Definitions
    // -------------------------------------------------------------------------
    const BASIC_ANIMATIONS = {};

    const anim_1_hello_world = {
        id: 1,
        title: "Hello World",
        canonicalId: "hello-world",
        category: "Java Fundamentals",
        approaches: [
            {
                id: "standard-output",
                name: "Standard Output Pipeline",
                timeComplexity: "O(1)",
                timeExplanation: "Single invocation of JVM PrintStream.println to write constant characters to standard output.",
                spaceComplexity: "O(1)",
                spaceExplanation: "String literal 'Hello, World!' stored once in JVM String Constant Pool.",
                javaCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
                steps: [
                    {
                        title: "JVM Class Loading & String Constant Pool",
                        what: "The Java Virtual Machine (JVM) loads the Main bytecode and allocates string literal 'Hello, World!' in the String Constant Pool in Metaspace/Heap.",
                        why: "String literals in Java are interned automatically to optimize memory across threads.",
                        variables: {"Class": "Main", "String Pool": "'Hello, World!'", "Stream": "System.out"},
                        takeaway: "Java program execution begins at public static void main(String[] args).",
                        javaLine: 2,
                        render: () => H.pipeline('JVM Class Loading & Constant Pool', [{label:'JVM ClassLoader', val:'Main.class', active:true}, {label:'String Constant Pool', val:'"Hello, World!"', success:true}, {label:'Standard Output', val:'System.out', active:false}])
                    },
                    {
                        title: "Invoking System.out.println()",
                        what: "The static PrintStream reference System.out executes println, passing the memory address of the interned string.",
                        why: "System.out delegates character encoding to the underlying host OS console/terminal buffer.",
                        variables: {"Target": "System.out", "Encoding": "UTF-8", "Method": "println"},
                        takeaway: "println flushes line terminator (\\n) immediately after writing the characters.",
                        javaLine: 3,
                        render: () => H.pipeline('PrintStream Invocation', [{label:'JVM Thread', val:'main', active:false}, {label:'Method Call', val:'println(...)', active:true}, {label:'Standard Output Buffer', val:'Flushing to Console...', active:true}])
                    },
                    {
                        title: "Terminal Output Emission",
                        what: "Standard output receives bytes and renders: Hello, World! followed by newline. Program exits cleanly with status 0.",
                        why: "The main method finishes its instructions and the JVM shuts down cleanly.",
                        variables: {"Output": "'Hello, World!'", "Exit Code": "0", "Status": "COMPLETED"},
                        takeaway: "The canonical first step in any language confirms working runtime, compiler, and I/O pipeline.",
                        javaLine: 4,
                        render: () => H.pipeline('Standard Output Stream Complete', [{label:'Standard Input', val:'(None)'}, {label:'Execution Engine', val:'main() returned', success:true}, {label:'Terminal Console', val:'Hello, World!', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['1'] = anim_1_hello_world;
    BASIC_ANIMATIONS['hello-world'] = anim_1_hello_world;

    const anim_2_swap_two_numbers = {
        id: 2,
        title: "Swap Two Numbers",
        canonicalId: "swap-two-numbers",
        category: "Java Fundamentals",
        approaches: [
            {
                id: "temp-variable",
                name: "Temporary Variable Swap (Recommended)",
                timeComplexity: "O(1)",
                timeExplanation: "Three scalar variable assignments executed in constant time.",
                spaceComplexity: "O(1)",
                spaceExplanation: "One additional 32-bit integer register used for temporary storage.",
                javaCode: "public class Main {\n    public static void main(String[] args) {\n        int a = 10, b = 20;\n        int temp = a;\n        a = b;\n        b = temp;\n        System.out.println(a + \" \" + b);\n    }\n}",
                steps: [
                    {
                        title: "Initial Memory Allocation",
                        what: "Variables a and b are initialized with values 10 and 20 on the call stack frame.",
                        why: "Directly overwriting either variable without preservation would destroy its initial value.",
                        variables: {"a": 10, "b": 20, "temp": "undefined"},
                        takeaway: "Direct assignment without a third store loses the overwritten operand.",
                        javaLine: 3,
                        render: () => H.registers('Initial State (Stack Frame)', [{name:'a', val:'10', active:true}, {name:'b', val:'20', active:true}, {name:'temp', val:'(empty)', active:false}], 'Initial input values: a = 10, b = 20')
                    },
                    {
                        title: "Step 1: Save 'a' into 'temp'",
                        what: "Assign temp = a. The value 10 is copied into temp so that variable a can be safely overwritten.",
                        why: "Creating an auxiliary copy protects the original value of a before overwriting.",
                        variables: {"a": 10, "b": 20, "temp": 10},
                        takeaway: "temp acts as a buffer holding the value of a.",
                        javaLine: 4,
                        render: () => H.registers('Save a into temp (temp = a)', [{name:'a', val:'10'}, {name:'b', val:'20'}, {name:'temp', val:'10', highlight:true}], 'Value 10 safely copied into temp buffer')
                    },
                    {
                        title: "Step 2: Assign 'b' into 'a'",
                        what: "Assign a = b. Variable a now holds 20. Notice both a and b currently hold 20.",
                        why: "Because a's original value (10) is preserved in temp, overwriting a is safe.",
                        variables: {"a": 20, "b": 20, "temp": 10},
                        takeaway: "Variable a has successfully received b's value.",
                        javaLine: 5,
                        render: () => H.registers('Overwrite a with b (a = b)', [{name:'a', val:'20', highlight:true}, {name:'b', val:'20'}, {name:'temp', val:'10'}], 'Variable a updated to 20')
                    },
                    {
                        title: "Step 3: Restore 'temp' into 'b'",
                        what: "Assign b = temp. Variable b now receives 10 from temp. The swap is complete: a = 20, b = 10.",
                        why: "Restoring temp finishes the circular exchange.",
                        variables: {"a": 20, "b": 10, "temp": 10, "Output": "'20 10'"},
                        takeaway: "Values successfully interchanged in 3 constant-time assignments.",
                        javaLine: 6,
                        render: () => H.registers('Restore temp into b (b = temp) — Done', [{name:'a', val:'20', done:true}, {name:'b', val:'10', done:true}, {name:'temp', val:'10'}], 'Final swapped state: a = 20, b = 10')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['2'] = anim_2_swap_two_numbers;
    BASIC_ANIMATIONS['swap-two-numbers'] = anim_2_swap_two_numbers;

    const anim_3_celsius_to_fahrenheit = {
        id: 3,
        title: "Celsius to Fahrenheit",
        canonicalId: "celsius-to-fahrenheit",
        category: "Java Fundamentals",
        approaches: [
            {
                id: "formula",
                name: "Standard Thermal Conversion Formula",
                timeComplexity: "O(1)",
                timeExplanation: "Single arithmetic multiplication and addition on IEEE 754 64-bit floating point numbers.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two double scalar registers for temperature variables C and F.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        double f = (c * 9.0 / 5.0) + 32.0;\n        System.out.printf(\"%.2f\\n\", f);\n    }\n}",
                steps: [
                    {
                        title: "Input Temperature Ingestion",
                        what: "Read temperature in Celsius c = 25.0 from standard input using Scanner.",
                        why: "We use double to maintain fractional temperature precision.",
                        variables: {"c": "25.0 \u00b0C", "F": "\u2014", "Formula": "(C * 9/5) + 32"},
                        takeaway: "Using floating point literals like 9.0 / 5.0 prevents unintended integer truncation.",
                        javaLine: 6,
                        render: () => H.pipeline('Input Celsius Ingestion', [{label:'Input Stream', val:'25.0'}, {label:'Variable c', val:'25.0 °C', active:true}, {label:'Variable f', val:'Uncalculated'}])
                    },
                    {
                        title: "Scale by 9.0 / 5.0 (1.8x)",
                        what: "Multiply 25.0 * 1.8 = 45.0. This scales the degree intervals from the 100-degree metric scale to the 180-degree Fahrenheit scale.",
                        why: "Fahrenheit has 180 degrees between freezing and boiling points compared to Celsius 100 degrees.",
                        variables: {"c": "25.0", "scaled (c * 1.8)": "45.0"},
                        takeaway: "9.0 / 5.0 evaluates to 1.8 in double precision.",
                        javaLine: 7,
                        render: () => H.comp('Degree Interval Scaling', '25.0', '* (9.0 / 5.0)', '45.0', '45.0', true)
                    },
                    {
                        title: "Add 32.0 Freezing Point Offset",
                        what: "Add 32.0: 45.0 + 32.0 = 77.0. Format to 2 decimal places: '77.00'.",
                        why: "Water freezes at 0\u00b0C but 32\u00b0F, requiring an additive offset of +32.",
                        variables: {"c": "25.0", "f": "77.0", "formatted": "'77.00'"},
                        takeaway: "System.out.printf with %.2f produces standard rounded scientific notation.",
                        javaLine: 8,
                        render: () => H.pipeline('Conversion Complete', [{label:'Scaled Value', val:'45.0'}, {label:'+ Freezing Offset', val:'+ 32.0', active:true}, {label:'Fahrenheit Output', val:'77.00 °F', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['3'] = anim_3_celsius_to_fahrenheit;
    BASIC_ANIMATIONS['celsius-to-fahrenheit'] = anim_3_celsius_to_fahrenheit;

    const anim_4_simple_interest_calculator = {
        id: 4,
        title: "Simple Interest Calculator",
        canonicalId: "simple-interest-calculator",
        category: "Java Fundamentals",
        approaches: [
            {
                id: "si-formula",
                name: "SI Linear Formula Computation",
                timeComplexity: "O(1)",
                timeExplanation: "Two scalar multiplications and one division in constant time.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores numerical parameters P, R, T, and SI in scalar registers.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double p = sc.nextDouble();\n        double r = sc.nextDouble();\n        double t = sc.nextDouble();\n        double si = (p * r * t) / 100.0;\n        System.out.printf(\"%.2f\\n\", si);\n    }\n}",
                steps: [
                    {
                        title: "Parameter Extraction (P, R, T)",
                        what: "Read Principal P = 1000.0, Annual Interest Rate R = 5.0%, and Time T = 2.0 years.",
                        why: "Financial computations require high-precision floating point parameters.",
                        variables: {"P": "1000.0", "R": "5.0%", "T": "2.0 years"},
                        takeaway: "Simple interest assumes interest does not compound over time.",
                        javaLine: 6,
                        render: () => H.registers('Financial Parameters Ingestion', [{name:'Principal (P)', val:'$1000.0'}, {name:'Rate (R)', val:'5.0%'}, {name:'Time (T)', val:'2.0 yrs'}], 'Parameters loaded from standard input')
                    },
                    {
                        title: "Product Calculation: P * R * T",
                        what: "Compute product: 1000.0 * 5.0 * 2.0 = 10000.0.",
                        why: "Interest accrues linearly proportional to principal, rate, and duration.",
                        variables: {"P*R*T": "10000.0"},
                        takeaway: "Evaluating numerator first prevents intermediate precision loss.",
                        javaLine: 9,
                        render: () => H.comp('Numerator Product', '1000.0 * 5.0', '*', '2.0', '10000.0', true)
                    },
                    {
                        title: "Divide by 100 & Format Output",
                        what: "Divide numerator 10000.0 / 100.0 = 100.00. Output: 100.00.",
                        why: "Rate was supplied as a whole percentage, so division by 100 converts it to decimal multiplier.",
                        variables: {"SI": "100.00", "Total Settlement": "$1100.00"},
                        takeaway: "Result formatted to standard 2 decimal currency precision.",
                        javaLine: 10,
                        render: () => H.pipeline('Final Interest Calculation', [{label:'Numerator (P*R*T)', val:'10000.0'}, {label:'Divide by 100', val:'/ 100.0', active:true}, {label:'Simple Interest (SI)', val:'$100.00', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['4'] = anim_4_simple_interest_calculator;
    BASIC_ANIMATIONS['simple-interest-calculator'] = anim_4_simple_interest_calculator;

    const anim_5_read_and_print_user_details = {
        id: 5,
        title: "Read and Print User Details",
        canonicalId: "read-and-print-user-details",
        category: "Input and Output",
        approaches: [
            {
                id: "scanner-tokens",
                name: "Scanner Token Stream Parsing",
                timeComplexity: "O(1)",
                timeExplanation: "Parses three fixed tokens from standard input stream buffer.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores one String and two primitive numbers in local memory.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.next();\n        int age = sc.nextInt();\n        double gpa = sc.nextDouble();\n        System.out.printf(\"Name: %s, Age: %d, GPA: %.2f\\n\", name, age, gpa);\n    }\n}",
                steps: [
                    {
                        title: "Scanner Input Buffer Initialization",
                        what: "Scanner connects to System.in with token stream: ['Alice', '20', '3.85'].",
                        why: "Scanner breaks input stream into tokens separated by whitespace automatically.",
                        variables: {"Token 1": "'Alice'", "Token 2": "'20'", "Token 3": "'3.85'"},
                        takeaway: "Scanner handles type conversion from raw characters to Java primitives.",
                        javaLine: 5,
                        render: () => H.pipeline('Input Buffer Tokens', [{label:'Token 0 (String)', val:'Alice', active:true}, {label:'Token 1 (int)', val:'20'}, {label:'Token 2 (double)', val:'3.85'}])
                    },
                    {
                        title: "Parsing Typed Variables",
                        what: "sc.next() reads String 'Alice', sc.nextInt() parses 20, sc.nextDouble() parses 3.85.",
                        why: "Typed methods validate lexical structure and populate stack registers.",
                        variables: {"name": "'Alice'", "age": 20, "gpa": 3.85},
                        takeaway: "Primitive parsing converts ASCII digit characters into binary integers and floating point values.",
                        javaLine: 6,
                        render: () => H.registers('Parsed Local Variables', [{name:'name (String)', val:'"Alice"', done:true}, {name:'age (int)', val:'20', done:true}, {name:'gpa (double)', val:'3.85', done:true}], 'Variables stored in stack frame')
                    },
                    {
                        title: "Composing Formatted Output String",
                        what: "Interpolate variables into template: 'Name: %s, Age: %d, GPA: %.2f'. Output: Name: Alice, Age: 20, GPA: 3.85.",
                        why: "Formatted string synthesis combines multiple data types into a structured human-readable record.",
                        variables: {"Output": "'Name: Alice, Age: 20, GPA: 3.85'"},
                        takeaway: "printf placeholders (%s, %d, %.2f) map directly to argument types.",
                        javaLine: 9,
                        render: () => H.pipeline('Formatted Output Generation', [{label:'Parsed Values', val:'Alice | 20 | 3.85'}, {label:'Formatter String', val:'printf(...)', active:true}, {label:'Console Output', val:'Name: Alice, Age: 20, GPA: 3.85', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['5'] = anim_5_read_and_print_user_details;
    BASIC_ANIMATIONS['read-and-print-user-details'] = anim_5_read_and_print_user_details;

    const anim_6_sum_of_two_numbers = {
        id: 6,
        title: "Sum of Two Numbers",
        canonicalId: "sum-of-two-numbers",
        category: "Input and Output",
        approaches: [
            {
                id: "scanner-add",
                name: "Linear Scanner Addition Pipeline",
                timeComplexity: "O(1)",
                timeExplanation: "Reads two integers and performs a single 64-bit integer ALU addition.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two long scalar registers for operands A and B.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        long sum = a + b;\n        System.out.println(sum);\n    }\n}",
                steps: [
                    {
                        title: "Reading Operands A and B",
                        what: "Scanner reads two space-separated integers: A = 15, B = 27.",
                        why: "Using 64-bit long guarantees safe addition even for large integer ranges up to 10^18 without overflow.",
                        variables: {"a": 15, "b": 27, "sum": "\u2014"},
                        takeaway: "Choosing long over 32-bit int prevents silent arithmetic overflow.",
                        javaLine: 6,
                        render: () => H.registers('Read Operands from Standard Input', [{name:'Operand a', val:'15', active:true}, {name:'Operand b', val:'27', active:true}], 'Input stream parsed: 15 and 27')
                    },
                    {
                        title: "ALU Binary Addition",
                        what: "The CPU Arithmetic Logic Unit (ALU) computes 15 + 27 = 42.",
                        why: "Binary addition operates in 1 CPU clock cycle.",
                        variables: {"a": 15, "b": 27, "sum": 42},
                        takeaway: "Fundamental binary addition combines operands into sum register.",
                        javaLine: 7,
                        render: () => H.comp('Arithmetic Addition (a + b)', '15', '+', '27', '42', true)
                    },
                    {
                        title: "Print Sum to Standard Output",
                        what: "System.out.println(42) prints '42' to the console and program terminates successfully.",
                        why: "Printing the scalar result concludes the program execution.",
                        variables: {"Output": "42", "Status": "ACCEPTED"},
                        takeaway: "Clean single-line output matches the automated grading specification.",
                        javaLine: 8,
                        render: () => H.pipeline('Output Generation', [{label:'Operand a', val:'15'}, {label:'Operand b', val:'27'}, {label:'Sum Result', val:'42', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['6'] = anim_6_sum_of_two_numbers;
    BASIC_ANIMATIONS['sum-of-two-numbers'] = anim_6_sum_of_two_numbers;

    const anim_7_formatted_receipt_printer = {
        id: 7,
        title: "Formatted Receipt Printer",
        canonicalId: "formatted-receipt-printer",
        category: "Input and Output",
        approaches: [
            {
                id: "receipt-format",
                name: "Formatted String Stream Alignment",
                timeComplexity: "O(1)",
                timeExplanation: "Processes fixed-width receipt fields in constant time.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores item, quantity, unit price, and total in scalar registers.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String item = sc.next();\n        int qty = sc.nextInt();\n        double price = sc.nextDouble();\n        double total = qty * price;\n        System.out.printf(\"Item: %s | Qty: %d | Total: $%.2f\\n\", item, qty, total);\n    }\n}",
                steps: [
                    {
                        title: "Receipt Line Item Extraction",
                        what: "Read item = 'Notebook', quantity = 3, and price per unit = $4.50.",
                        why: "Captures both textual description and numeric billing parameters.",
                        variables: {"item": "'Notebook'", "qty": 3, "price": "$4.50"},
                        takeaway: "Mixing String, int, and double requires careful token extraction.",
                        javaLine: 6,
                        render: () => H.registers('Extracted Receipt Parameters', [{name:'Item', val:'"Notebook"'}, {name:'Quantity', val:'3'}, {name:'Unit Price', val:'$4.50'}], 'Input parameters loaded')
                    },
                    {
                        title: "Total Billing Calculation",
                        what: "Multiply quantity * unit price: 3 * 4.50 = 13.50.",
                        why: "Line item total represents quantity multiplied by base price.",
                        variables: {"qty": 3, "price": 4.5, "total": 13.5},
                        takeaway: "Floating point multiplication calculates exact monetary subtotal.",
                        javaLine: 9,
                        render: () => H.comp('Subtotal Calculation', '3 (qty)', '*', '$4.50 (price)', '$13.50', true)
                    },
                    {
                        title: "Structured Receipt Formatting",
                        what: "Generate formatted receipt: 'Item: Notebook | Qty: 3 | Total: $13.50'.",
                        why: "Piped column formatting produces clean point-of-sale text reports.",
                        variables: {"Receipt Output": "'Item: Notebook | Qty: 3 | Total: $13.50'"},
                        takeaway: "%.2f forces exactly two fractional digits ($13.50 instead of $13.5).",
                        javaLine: 10,
                        render: () => H.pipeline('Receipt Line Emitted', [{label:'Item Tag', val:'Notebook'}, {label:'Qty Column', val:'3'}, {label:'Total Amount', val:'$13.50', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['7'] = anim_7_formatted_receipt_printer;
    BASIC_ANIMATIONS['formatted-receipt-printer'] = anim_7_formatted_receipt_printer;

    const anim_8_arithmetic_operations = {
        id: 8,
        title: "Arithmetic Operations",
        canonicalId: "arithmetic-operations",
        category: "Operators",
        approaches: [
            {
                id: "arithmetic-demo",
                name: "Standard Binary Arithmetic Suite",
                timeComplexity: "O(1)",
                timeExplanation: "Each arithmetic operation executes in a single CPU cycle.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Fixed scalar storage for operands a and b.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n        System.out.println(a - b);\n        System.out.println(a * b);\n        System.out.println(a / b);\n        System.out.println(a % b);\n    }\n}",
                steps: [
                    {
                        title: "Operands Input (a = 20, b = 6)",
                        what: "Load operands a = 20 and b = 6 into registers.",
                        why: "Both operands are positive integers for demonstrating all 5 basic operators.",
                        variables: {"a": 20, "b": 6},
                        takeaway: "Java supports +, -, *, /, and % binary operators.",
                        javaLine: 6,
                        render: () => H.registers('Operands Ingestion', [{name:'a', val:'20', active:true}, {name:'b', val:'6', active:true}], 'Operands: a = 20, b = 6')
                    },
                    {
                        title: "Addition (+) and Subtraction (-)",
                        what: "Compute sum: 20 + 6 = 26. Compute difference: 20 - 6 = 14.",
                        why: "Additive operations perform standard signed arithmetic.",
                        variables: {"a + b": 26, "a - b": 14},
                        takeaway: "Additive operators have equal precedence and associate left-to-right.",
                        javaLine: 7,
                        render: () => H.registers('Additive Results', [{name:'20 + 6 (Sum)', val:'26', done:true}, {name:'20 - 6 (Diff)', val:'14', done:true}])
                    },
                    {
                        title: "Multiplication (*)",
                        what: "Compute product: 20 * 6 = 120.",
                        why: "Multiplication has higher precedence than addition and subtraction.",
                        variables: {"a * b": 120},
                        takeaway: "Watch out for potential 32-bit integer overflow when multiplying large numbers.",
                        javaLine: 9,
                        render: () => H.comp('Multiplication Product', '20', '*', '6', '120', true)
                    },
                    {
                        title: "Integer Division (/) vs Remainder (%)",
                        what: "Compute integer quotient: 20 / 6 = 3. Compute remainder: 20 % 6 = 2.",
                        why: "Integer division truncates fractional components towards zero; modulo captures leftover remainder.",
                        variables: {"20 / 6": "3 (Quotient)", "20 % 6": "2 (Remainder)"},
                        takeaway: "Divisor relationship holds: (Quotient * Divisor) + Remainder = Dividend (3 * 6 + 2 = 20).",
                        javaLine: 10,
                        render: () => H.registers('Division & Modulo Pair', [{name:'20 / 6 (Quotient)', val:'3', done:true}, {name:'20 % 6 (Remainder)', val:'2', done:true}], 'Division truncates; Modulo captures remainder')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['8'] = anim_8_arithmetic_operations;
    BASIC_ANIMATIONS['arithmetic-operations'] = anim_8_arithmetic_operations;

    const anim_9_bitwise_operators_demo = {
        id: 9,
        title: "Bitwise AND, OR, and XOR",
        canonicalId: "bitwise-operators-demo",
        category: "Operators",
        approaches: [
            {
                id: "bitwise-logic",
                name: "Bit-Level Boolean Logic",
                timeComplexity: "O(1)",
                timeExplanation: "Parallel bitwise logic executes across all 32 bits simultaneously in 1 cycle.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two integer bit registers.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a & b);\n        System.out.println(a | b);\n        System.out.println(a ^ b);\n    }\n}",
                steps: [
                    {
                        title: "Binary Representation (a = 12, b = 10)",
                        what: "Convert to 4-bit binary: 12 is 1100\u2082, 10 is 1010\u2082.",
                        why: "Bitwise operations apply Boolean logic independently across aligned bit columns.",
                        variables: {"a": "12 (1100\u2082)", "b": "10 (1010\u2082)"},
                        takeaway: "Every bit position is evaluated independently without carry.",
                        javaLine: 6,
                        render: () => H.registers('Binary Decomposition', [{name:'a (decimal 12)', val:'1 1 0 0₂'}, {name:'b (decimal 10)', val:'1 0 1 0₂'}], 'Bit columns aligned: Bit 3, 2, 1, 0')
                    },
                    {
                        title: "Bitwise AND (&): 1100 & 1010 = 1000\u2082 (8)",
                        what: "AND yields 1 ONLY when both corresponding bits are 1. Here, only bit 3 has both 1s: 1000\u2082 = 8.",
                        why: "Useful for masking and checking specific bit flags.",
                        variables: {"Operation": "12 & 10", "Binary": "1000\u2082", "Decimal": 8},
                        takeaway: "Bitwise AND filters out any bit where the mask is 0.",
                        javaLine: 7,
                        render: () => H.comp('Bitwise AND (&)', '1100₂ (12)', '&', '1010₂ (10)', '1000₂ (8)', true)
                    },
                    {
                        title: "Bitwise OR (|): 1100 | 1010 = 1110\u2082 (14)",
                        what: "OR yields 1 if either bit is 1. Bits 3, 2, and 1 are 1: 1110\u2082 = 14.",
                        why: "Useful for setting bit flags without modifying other bits.",
                        variables: {"Operation": "12 | 10", "Binary": "1110\u2082", "Decimal": 14},
                        takeaway: "Bitwise OR turns on all bits present in either operand.",
                        javaLine: 8,
                        render: () => H.comp('Bitwise OR (|)', '1100₂ (12)', '|', '1010₂ (10)', '1110₂ (14)', true)
                    },
                    {
                        title: "Bitwise XOR (^): 1100 ^ 1010 = 0110\u2082 (6)",
                        what: "XOR (Exclusive OR) yields 1 ONLY when the bits differ. Bits 2 and 1 differ: 0110\u2082 = 6.",
                        why: "Useful for parity checks, bit toggling, and fast element cancellation.",
                        variables: {"Operation": "12 ^ 10", "Binary": "0110\u2082", "Decimal": 6},
                        takeaway: "x ^ x = 0 and x ^ 0 = x (fundamental XOR properties).",
                        javaLine: 9,
                        render: () => H.comp('Bitwise XOR (^)', '1100₂ (12)', '^', '1010₂ (10)', '0110₂ (6)', true)
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['9'] = anim_9_bitwise_operators_demo;
    BASIC_ANIMATIONS['bitwise-operators-demo'] = anim_9_bitwise_operators_demo;

    const anim_10_ternary_operator_maximum = {
        id: 10,
        title: "Maximum of Two via Ternary",
        canonicalId: "ternary-operator-maximum",
        category: "Operators",
        approaches: [
            {
                id: "ternary-max",
                name: "Ternary Conditional Operator (a > b ? a : b)",
                timeComplexity: "O(1)",
                timeExplanation: "Single relational comparison followed by branchless conditional assignment.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two scalar input variables and one result register.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int max = (a > b) ? a : b;\n        System.out.println(max);\n    }\n}",
                steps: [
                    {
                        title: "Load Operands (a = 45, b = 82)",
                        what: "Load values a = 45 and b = 82 from standard input.",
                        why: "We want to find the larger number without verbose if-else statements.",
                        variables: {"a": 45, "b": 82, "max": "\u2014"},
                        takeaway: "The ternary operator is Java's only three-operand operator (condition ? expr1 : expr2).",
                        javaLine: 6,
                        render: () => H.registers('Ternary Operands', [{name:'a', val:'45'}, {name:'b', val:'82'}], 'Operands loaded for evaluation')
                    },
                    {
                        title: "Evaluate Boolean Condition: (45 > 82)",
                        what: "Test condition (a > b): 45 > 82 evaluates to FALSE.",
                        why: "The truth value of the boolean expression determines which branch is chosen.",
                        variables: {"Condition": "(45 > 82)", "Evaluated": "false"},
                        takeaway: "When condition is false, the expression after the colon (:) is selected.",
                        javaLine: 7,
                        render: () => H.comp('Condition Check (a > b)', '45', '>', '82', 'FALSE', false)
                    },
                    {
                        title: "Select False Branch (b = 82)",
                        what: "Because condition is FALSE, value of b (82) is evaluated and assigned to max.",
                        why: "Short-circuit evaluation only executes the selected branch expression.",
                        variables: {"Selected Branch": "b (82)", "max": 82, "Output": 82},
                        takeaway: "The ternary expression returns 82 in concise inline syntax.",
                        javaLine: 8,
                        render: () => H.pipeline('Ternary Branch Resolution', [{label:'Condition: 45 > 82', val:'FALSE'}, {label:'Branch Taken', val:': b (82)', active:true}, {label:'Max Result', val:'82', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['10'] = anim_10_ternary_operator_maximum;
    BASIC_ANIMATIONS['ternary-operator-maximum'] = anim_10_ternary_operator_maximum;

    const anim_11_even_or_odd = {
        id: 11,
        title: "Even or Odd",
        canonicalId: "even-or-odd",
        category: "Conditional Statements",
        approaches: [
            {
                id: "modulo-check",
                name: "Modulo 2 Parity Check",
                timeComplexity: "O(1)",
                timeExplanation: "Single integer remainder division (n % 2) executes in 1 cycle.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores input integer n.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n % 2 == 0) {\n            System.out.println(\"Even\");\n        } else {\n            System.out.println(\"Odd\");\n        }\n    }\n}",
                steps: [
                    {
                        title: "Input Integer Ingestion",
                        what: "Read integer n = 7 from standard input.",
                        why: "Integer parity depends entirely on the least significant bit or divisibility by 2.",
                        variables: {"n": 7, "Divisor": 2},
                        takeaway: "Even numbers are cleanly divisible by 2; odd numbers leave a remainder of 1 (or -1 for negative).",
                        javaLine: 6,
                        render: () => H.registers('Input Number Ingestion', [{name:'n', val:'7', active:true}, {name:'Divisor', val:'2'}], 'Testing number n = 7')
                    },
                    {
                        title: "Evaluate Remainder: 7 % 2",
                        what: "Compute modulo operation: 7 % 2 = 1.",
                        why: "Division 7 / 2 yields quotient 3 with remainder 1.",
                        variables: {"n": 7, "Remainder (7 % 2)": 1},
                        takeaway: "A remainder of 1 proves the number has an odd parity.",
                        javaLine: 7,
                        render: () => H.comp('Modulo Evaluation (n % 2)', '7', '%', '2', '1 (Remainder != 0)', false)
                    },
                    {
                        title: "Branch to Else Block \u2014 Output 'Odd'",
                        what: "Because (7 % 2 == 0) is false, the execution branches into the else block. Output: 'Odd'.",
                        why: "The if-condition evaluates to false, skipping the 'Even' branch entirely.",
                        variables: {"Condition": "7 % 2 == 0 (False)", "Branch Taken": "else", "Output": "'Odd'"},
                        takeaway: "Binary conditionals direct program control into mutually exclusive execution paths.",
                        javaLine: 9,
                        render: () => H.pipeline('Conditional Branch Resolution', [{label:'Condition Check', val:'7 % 2 == 0 (FALSE)'}, {label:'Active Branch', val:'else { print("Odd") }', success:true}, {label:'Terminal Output', val:'Odd', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['11'] = anim_11_even_or_odd;
    BASIC_ANIMATIONS['even-or-odd'] = anim_11_even_or_odd;

    const anim_12_largest_of_three_numbers = {
        id: 12,
        title: "Largest of Three Numbers",
        canonicalId: "largest-of-three-numbers",
        category: "Conditional Statements",
        approaches: [
            {
                id: "relational-compare",
                name: "Sequential Relational Comparison",
                timeComplexity: "O(1)",
                timeExplanation: "At most two conditional comparisons between three scalar variables.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores three integers a, b, and c.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        int max = a;\n        if (b > max) max = b;\n        if (c > max) max = c;\n        System.out.println(max);\n    }\n}",
                steps: [
                    {
                        title: "Input Numbers & Initialize max = a",
                        what: "Read a = 15, b = 42, c = 27. Initialize max = a = 15.",
                        why: "Assuming the first element is the maximum establishes a baseline comparison reference.",
                        variables: {"a": 15, "b": 42, "c": 27, "max": 15},
                        takeaway: "Incremental comparison scales cleanly to any number of inputs.",
                        javaLine: 9,
                        render: () => H.registers('Initial Candidate', [{name:'a', val:'15'}, {name:'b', val:'42'}, {name:'c', val:'27'}, {name:'current max', val:'15', highlight:true}], 'Baseline max initialized to a = 15')
                    },
                    {
                        title: "Compare with Second Number: (42 > 15)",
                        what: "Evaluate if (b > max): 42 > 15 is TRUE. Update max = b = 42.",
                        why: "Since b is larger than the current maximum, it becomes the new champion.",
                        variables: {"Comparison": "42 > 15 (True)", "max": 42},
                        takeaway: "max updates dynamically whenever a strictly larger candidate is observed.",
                        javaLine: 10,
                        render: () => H.comp('Candidate b Comparison', 'b (42)', '>', 'max (15)', 'TRUE -> max = 42', true)
                    },
                    {
                        title: "Compare with Third Number: (27 > 42)",
                        what: "Evaluate if (c > max): 27 > 42 is FALSE. max remains 42.",
                        why: "Since c is not greater than the current max, no assignment occurs.",
                        variables: {"Comparison": "27 > 42 (False)", "max": 42, "Final Output": 42},
                        takeaway: "All elements have been compared; max holds the global maximum.",
                        javaLine: 11,
                        render: () => H.comp('Candidate c Comparison', 'c (27)', '>', 'max (42)', 'FALSE -> max kept', false)
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['12'] = anim_12_largest_of_three_numbers;
    BASIC_ANIMATIONS['largest-of-three-numbers'] = anim_12_largest_of_three_numbers;

    const anim_13_leap_year_checker = {
        id: 13,
        title: "Leap Year Checker",
        canonicalId: "leap-year-checker",
        category: "Conditional Statements",
        approaches: [
            {
                id: "gregorian-rules",
                name: "Gregorian Calendar Compound Logic",
                timeComplexity: "O(1)",
                timeExplanation: "Evaluates composite boolean expression (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0).",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores year integer.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int year = sc.nextInt();\n        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n        if (isLeap) {\n            System.out.println(\"Leap Year\");\n        } else {\n            System.out.println(\"Not Leap Year\");\n        }\n    }\n}",
                steps: [
                    {
                        title: "Input Year Ingestion (year = 2024)",
                        what: "Read year = 2024 from standard input.",
                        why: "Earth takes ~365.2425 days to orbit the sun; leap rules compensate for the fractional day.",
                        variables: {"year": 2024, "Target Rules": "Divisible by 4, not 100, unless 400"},
                        takeaway: "Century years (1900, 2100) are not leap years unless divisible by 400 (2000).",
                        javaLine: 6,
                        render: () => H.registers('Year Under Test', [{name:'Year', val:'2024', active:true}], 'Testing year 2024 against astronomical calendar rules')
                    },
                    {
                        title: "Rule 1: Divisible by 4 Check",
                        what: "Test 2024 % 4 == 0: 2024 / 4 = 506 remainder 0. Condition is TRUE.",
                        why: "Basic 4-year cycle adds 1 day every quadrennium.",
                        variables: {"2024 % 4": "0 (True)"},
                        takeaway: "Passing the first rule qualifies the candidate for the century check.",
                        javaLine: 7,
                        render: () => H.comp('Divisible by 4 Check', '2024 % 4', '==', '0', 'TRUE', true)
                    },
                    {
                        title: "Rule 2: Not Century Year Check",
                        what: "Test 2024 % 100 != 0: 2024 % 100 = 24 != 0. Condition is TRUE.",
                        why: "2024 is not a century year, so it avoids the century exclusion penalty.",
                        variables: {"2024 % 100 != 0": "True", "Combined Clause": "TRUE && TRUE = TRUE"},
                        takeaway: "Because (year % 4 == 0 && year % 100 != 0) is true, isLeap evaluates to TRUE.",
                        javaLine: 7,
                        render: () => H.comp('Century Exclusion Check', '2024 % 100', '!=', '0', 'TRUE (Not a century year)', true)
                    },
                    {
                        title: "Emit Verdict \u2014 'Leap Year'",
                        what: "isLeap is true. Output: 'Leap Year'.",
                        why: "2024 satisfies all Gregorian leap year conditions.",
                        variables: {"isLeap": "true", "Output": "'Leap Year'"},
                        takeaway: "February in 2024 contains 29 days.",
                        javaLine: 9,
                        render: () => H.pipeline('Verdict Determination', [{label:'Rule 1 (% 4)', val:'PASS (0)', success:true}, {label:'Rule 2 (% 100)', val:'PASS (!=0)', success:true}, {label:'Verdict', val:'Leap Year', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['13'] = anim_13_leap_year_checker;
    BASIC_ANIMATIONS['leap-year-checker'] = anim_13_leap_year_checker;

    const anim_14_grade_calculator = {
        id: 14,
        title: "Grade Calculator",
        canonicalId: "grade-calculator",
        category: "Conditional Statements",
        approaches: [
            {
                id: "if-else-ladder",
                name: "Conditional If-Else Ladder",
                timeComplexity: "O(1)",
                timeExplanation: "Checks at most 5 interval boundaries in descending order.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores score integer and grade character.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt();\n        char grade;\n        if (m >= 90) grade = 'A';\n        else if (m >= 80) grade = 'B';\n        else if (m >= 70) grade = 'C';\n        else if (m >= 60) grade = 'D';\n        else grade = 'F';\n        System.out.println(grade);\n    }\n}",
                steps: [
                    {
                        title: "Score Ingestion (Score = 85)",
                        what: "Read integer examination mark m = 85.",
                        why: "Descending ladder checks require scores between 0 and 100.",
                        variables: {"m": 85, "grade": "unassigned"},
                        takeaway: "Evaluating from highest bracket downwards simplifies conditions by implicitly eliminating higher ranges.",
                        javaLine: 6,
                        render: () => H.registers('Student Mark Ingestion', [{name:'Score (m)', val:'85', active:true}], 'Evaluating letter grade brackets for score 85')
                    },
                    {
                        title: "Check Bracket A: (85 >= 90)",
                        what: "Evaluate if (85 >= 90): Condition is FALSE. Proceed down ladder.",
                        why: "Score does not meet minimum cutoff of 90 for Grade A.",
                        variables: {"85 >= 90": "False"},
                        takeaway: "When a branch is false, execution falls through to the next else-if.",
                        javaLine: 8,
                        render: () => H.comp('Check Bracket A (>= 90)', '85', '>=', '90', 'FALSE', false)
                    },
                    {
                        title: "Check Bracket B: (85 >= 80) \u2014 Matched!",
                        what: "Evaluate else if (85 >= 80): Condition is TRUE! Assign grade = 'B'.",
                        why: "85 is >= 80 and < 90, matching Grade B range exactly.",
                        variables: {"85 >= 80": "True", "grade": "'B'"},
                        takeaway: "Because this condition is true, subsequent else branches are bypassed entirely.",
                        javaLine: 9,
                        render: () => H.comp('Check Bracket B (>= 80)', '85', '>=', '80', 'TRUE -> Grade B', true)
                    },
                    {
                        title: "Emit Final Letter Grade 'B'",
                        what: "Print grade 'B' to console. Program completes.",
                        why: "Ladder terminates cleanly upon matching the appropriate bracket.",
                        variables: {"Output": "'B'", "Status": "COMPLETED"},
                        takeaway: "Clean interval classification achieved with zero redundant checks.",
                        javaLine: 13,
                        render: () => H.pipeline('Final Grade Resolution', [{label:'Score', val:'85'}, {label:'Matched Interval', val:'[80..89] -> B', success:true}, {label:'Emitted Grade', val:'B', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['14'] = anim_14_grade_calculator;
    BASIC_ANIMATIONS['grade-calculator'] = anim_14_grade_calculator;

    const anim_15_multiplication_table = {
        id: 15,
        title: "Multiplication Table",
        canonicalId: "multiplication-table",
        category: "Loops",
        approaches: [
            {
                id: "for-loop",
                name: "Deterministic For-Loop Iteration (1..10)",
                timeComplexity: "O(1)",
                timeExplanation: "Executes exactly 10 iterations irrespective of N.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores loop counter i and base integer N.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= 10; i++) {\n            System.out.println(n + \" x \" + i + \" = \" + (n * i));\n        }\n    }\n}",
                steps: [
                    {
                        title: "Loop Initialization (i = 1, N = 5)",
                        what: "Initialize loop counter i = 1. Base multiplier N = 5. Loop guard condition: i <= 10.",
                        why: "Multiplication table traditionally spans integers 1 to 10.",
                        variables: {"N": 5, "i": 1, "product": 5},
                        takeaway: "A standard for-loop combines initialization, termination test, and step increment in one header.",
                        javaLine: 7,
                        render: () => H.registers('Loop State: Iteration 1', [{name:'N', val:'5'}, {name:'i', val:'1', active:true}, {name:'5 x 1', val:'5', done:true}], 'First row: 5 x 1 = 5')
                    },
                    {
                        title: "Midpoint Iteration (i = 5)",
                        what: "Loop counter advances to i = 5. Compute 5 * 5 = 25. Output: '5 x 5 = 25'.",
                        why: "Each step increments i by 1 and multiplies with constant N.",
                        variables: {"N": 5, "i": 5, "product": 25},
                        takeaway: "State variable i tracks sequential progression.",
                        javaLine: 8,
                        render: () => H.registers('Loop State: Iteration 5', [{name:'N', val:'5'}, {name:'i', val:'5', active:true}, {name:'5 x 5', val:'25', done:true}], 'Midpoint row: 5 x 5 = 25')
                    },
                    {
                        title: "Final Iteration (i = 10) & Loop Termination",
                        what: "Compute final row: 5 * 10 = 50. Loop increments i to 11; test (11 <= 10) fails, exiting loop.",
                        why: "Guard condition fails when i exceeds 10, terminating the loop safely.",
                        variables: {"N": 5, "i": 10, "product": 50, "Total Rows": 10},
                        takeaway: "10 formatted multiplication rows emitted to console.",
                        javaLine: 7,
                        render: () => H.pipeline('Table Generation Complete', [{label:'Start i=1', val:'5 x 1 = 5'}, {label:'Mid i=5', val:'5 x 5 = 25'}, {label:'End i=10', val:'5 x 10 = 50', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['15'] = anim_15_multiplication_table;
    BASIC_ANIMATIONS['multiplication-table'] = anim_15_multiplication_table;

    const anim_16_sum_of_first_n_numbers = {
        id: 16,
        title: "Sum of First N Natural Numbers",
        canonicalId: "sum-of-first-n-numbers",
        category: "Loops",
        approaches: [
            {
                id: "accumulator-loop",
                name: "Iterative Accumulator Loop",
                timeComplexity: "O(N)",
                timeExplanation: "Performs N iterations adding each successive integer into total.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two scalar 64-bit registers (sum and i).",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long sum = 0;\n        for (long i = 1; i <= n; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}",
                steps: [
                    {
                        title: "Initialize Accumulator sum = 0 (N = 10)",
                        what: "Input target N = 10. Initialize accumulator register sum = 0.",
                        why: "An accumulator starts at the additive identity (0) and aggregates terms sequentially.",
                        variables: {"N": 10, "sum": 0, "i": 1},
                        takeaway: "Accumulators are fundamental patterns for reductions like sums, counts, and averages.",
                        javaLine: 7,
                        render: () => H.registers('Accumulator Setup', [{name:'N', val:'10'}, {name:'sum', val:'0', active:true}, {name:'i', val:'1'}], 'Initial accumulator state: sum = 0')
                    },
                    {
                        title: "Accumulation Phase (i = 1 to 5)",
                        what: "After 5 iterations: sum = 1 + 2 + 3 + 4 + 5 = 15.",
                        why: "Each iteration performs sum = sum + i.",
                        variables: {"i": 5, "sum": 15},
                        takeaway: "Running total steadily accumulates consecutive terms.",
                        javaLine: 9,
                        render: () => H.pipeline('Accumulation Progress (i = 1..5)', [{label:'Terms 1+2+3', val:'6'}, {label:'+ Term 4', val:'10'}, {label:'+ Term 5', val:'15', active:true}])
                    },
                    {
                        title: "Complete Loop to N = 10 \u2014 Total = 55",
                        what: "Complete remaining terms: 15 + 6 + 7 + 8 + 9 + 10 = 55. Loop terminates at i = 11.",
                        why: "All integers up to N have been incorporated into sum.",
                        variables: {"N": 10, "sum": 55, "Final Output": 55},
                        takeaway: "Matches Gauss formula: N * (N + 1) / 2 = 10 * 11 / 2 = 55.",
                        javaLine: 11,
                        render: () => H.registers('Final Accumulated Sum', [{name:'N', val:'10'}, {name:'Final sum', val:'55', done:true}, {name:'Gauss Check: 10*11/2', val:'55', done:true}], 'Sum of first 10 numbers is 55')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['16'] = anim_16_sum_of_first_n_numbers;
    BASIC_ANIMATIONS['sum-of-first-n-numbers'] = anim_16_sum_of_first_n_numbers;

    const anim_17_factorial_of_a_number = {
        id: 17,
        title: "Factorial of a Number",
        canonicalId: "factorial-of-a-number",
        category: "Loops",
        approaches: [
            {
                id: "iterative-product",
                name: "Iterative Running Product",
                timeComplexity: "O(N)",
                timeExplanation: "N multiplications from 1 up to N.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Uses 64-bit long accumulator for product.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long fact = 1;\n        for (int i = 1; i <= n; i++) {\n            fact *= i;\n        }\n        System.out.println(fact);\n    }\n}",
                steps: [
                    {
                        title: "Initialize Product fact = 1 (N = 5)",
                        what: "Read N = 5. Initialize multiplicative accumulator fact = 1 (0! = 1, 1! = 1).",
                        why: "Multiplicative identity is 1 (multiplying by 0 would destroy the product).",
                        variables: {"N": 5, "fact": 1, "i": 1},
                        takeaway: "Starting with 1 correctly handles N = 0 and N = 1 base cases.",
                        javaLine: 7,
                        render: () => H.registers('Factorial Multiplicative Setup', [{name:'N', val:'5'}, {name:'fact', val:'1', active:true}], 'Initial product initialized to multiplicative identity 1')
                    },
                    {
                        title: "Multiply i = 2, 3: fact = 6",
                        what: "fact = 1 * 2 = 2. Then fact = 2 * 3 = 6.",
                        why: "Factorial grows factorially: each step scales by the next integer.",
                        variables: {"i": 3, "fact": 6},
                        takeaway: "Factorials grow extremely fast (combinatorial explosion).",
                        javaLine: 9,
                        render: () => H.comp('Multiplicative Step (i = 3)', 'fact (2)', '*', 'i (3)', '6', true)
                    },
                    {
                        title: "Multiply i = 4, 5: fact = 120",
                        what: "fact = 6 * 4 = 24. Finally, fact = 24 * 5 = 120. Output: 120.",
                        why: "All terms 1 * 2 * 3 * 4 * 5 multiplied. Output result.",
                        variables: {"N": 5, "fact": 120, "Output": 120},
                        takeaway: "5! = 120.",
                        javaLine: 11,
                        render: () => H.pipeline('Factorial Accumulation Complete', [{label:'1 * 2 * 3', val:'6'}, {label:'* 4', val:'24'}, {label:'* 5 (Final)', val:'120', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['17'] = anim_17_factorial_of_a_number;
    BASIC_ANIMATIONS['factorial-of-a-number'] = anim_17_factorial_of_a_number;

    const anim_18_count_digits_in_number = {
        id: 18,
        title: "Count Digits in an Integer",
        canonicalId: "count-digits-in-number",
        category: "Loops",
        approaches: [
            {
                id: "repeated-division",
                name: "Repeated Integer Division by 10",
                timeComplexity: "O(log10 N)",
                timeExplanation: "Divides N by 10 in each iteration, running proportional to the number of digits.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two integer scalar variables.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        if (n == 0) {\n            System.out.println(1);\n            return;\n        }\n        if (n < 0) n = -n;\n        int count = 0;\n        while (n > 0) {\n            n /= 10;\n            count++;\n        }\n        System.out.println(count);\n    }\n}",
                steps: [
                    {
                        title: "Input Ingestion (N = 45892)",
                        what: "Read integer N = 45892. Initialize digit count = 0.",
                        why: "Every division by 10 in decimal chops off the rightmost digit.",
                        variables: {"n": 45892, "count": 0},
                        takeaway: "Dividing by 10 shifts decimal digits right by one place.",
                        javaLine: 12,
                        render: () => H.registers('Initial State', [{name:'n', val:'45892', active:true}, {name:'count', val:'0'}], 'Target: Count digits in 45892')
                    },
                    {
                        title: "Chop Digits: 45892 -> 4589 -> 458 -> 45",
                        what: "Step 1: n /= 10 -> 4589 (count=1). Step 2: 458 (count=2). Step 3: 45 (count=3).",
                        why: "Integer division truncates the remainder.",
                        variables: {"n": 45, "count": 3},
                        takeaway: "Logarithmic reduction removes 1 digit per iteration.",
                        javaLine: 14,
                        render: () => H.pipeline('Digit Truncation Sequence', [{label:'45892 / 10', val:'4589 (cnt=1)'}, {label:'4589 / 10', val:'458 (cnt=2)'}, {label:'458 / 10', val:'45 (cnt=3)', active:true}])
                    },
                    {
                        title: "Final Reductions: 45 -> 4 -> 0",
                        what: "Step 4: 45 / 10 = 4 (count=4). Step 5: 4 / 10 = 0 (count=5). n reaches 0, while loop terminates.",
                        why: "When n reaches 0, all digits have been counted. Return count = 5.",
                        variables: {"n": 0, "count": 5, "Output": 5},
                        takeaway: "Total digits in 45892 is 5.",
                        javaLine: 17,
                        render: () => H.registers('Count Complete', [{name:'Final n', val:'0'}, {name:'Total Digits (count)', val:'5', done:true}], 'Terminated at n=0. Total digits = 5')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['18'] = anim_18_count_digits_in_number;
    BASIC_ANIMATIONS['count-digits-in-number'] = anim_18_count_digits_in_number;

    const anim_19_prime_number_checker = {
        id: 19,
        title: "Prime Number Checker",
        canonicalId: "prime-number-checker",
        category: "Number Problems",
        approaches: [
            {
                id: "sqrt-trial-division",
                name: "Trial Division up to Square Root (\u221aN)",
                timeComplexity: "O(\u221aN)",
                timeExplanation: "If N has a factor greater than \u221aN, it must also have a symmetric co-factor smaller than \u221aN.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Fixed scalar variables.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n <= 1) {\n            System.out.println(\"Not Prime\");\n            return;\n        }\n        boolean isPrime = true;\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i == 0) {\n                isPrime = false;\n                break;\n            }\n        }\n        System.out.println(isPrime ? \"Prime\" : \"Not Prime\");\n    }\n}",
                steps: [
                    {
                        title: "Input Ingestion & Boundary Test (N = 29)",
                        what: "Read integer N = 29. Check boundary: 29 > 1, so candidate is valid.",
                        why: "Numbers <= 1 (such as 0 and 1) are defined as non-prime by mathematical convention.",
                        variables: {"N": 29, "Bound (\u221a29)": "~5.38", "isPrime": "true"},
                        takeaway: "We only need to test divisors i where i * i <= N (i.e. i <= 5).",
                        javaLine: 7,
                        render: () => H.registers('Prime Candidate Setup', [{name:'Candidate N', val:'29', active:true}, {name:'Limit (√29)', val:'i <= 5'}], 'Testing candidate 29 up to divisor 5')
                    },
                    {
                        title: "Test Divisors i = 2, 3, 4, 5",
                        what: "29 % 2 = 1 (!= 0). 29 % 3 = 2 (!= 0). 29 % 4 = 1 (!= 0). 29 % 5 = 4 (!= 0).",
                        why: "None of the candidate divisors divide 29 with zero remainder.",
                        variables: {"Tested": "[2, 3, 4, 5]", "Any Divisors": "None"},
                        takeaway: "Testing up to \u221aN eliminates redundant checks: testing 6..28 is completely unnecessary.",
                        javaLine: 12,
                        render: () => H.pipeline('Divisor Trial Checks', [{label:'29 % 2', val:'1 (PASS)'}, {label:'29 % 3', val:'2 (PASS)'}, {label:'29 % 5', val:'4 (PASS)', success:true}])
                    },
                    {
                        title: "Loop Exhaustion \u2014 Confirm 'Prime'",
                        what: "Next i = 6 exceeds limit (6 * 6 = 36 > 29). Loop terminates. isPrime remains true. Output: 'Prime'.",
                        why: "No integer factor exists between 2 and \u221a29; therefore 29 is strictly prime.",
                        variables: {"N": 29, "Verdict": "'Prime'"},
                        takeaway: "N = 29 has exactly two positive divisors: 1 and 29.",
                        javaLine: 17,
                        render: () => H.pipeline('Prime Declaration', [{label:'Tested Range', val:'[2..5]'}, {label:'Factors Found', val:'0', success:true}, {label:'Verdict', val:'Prime', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['19'] = anim_19_prime_number_checker;
    BASIC_ANIMATIONS['prime-number-checker'] = anim_19_prime_number_checker;

    const anim_20_fibonacci_series = {
        id: 20,
        title: "Fibonacci Sequence Generator",
        canonicalId: "fibonacci-series",
        category: "Number Problems",
        approaches: [
            {
                id: "iterative-fib",
                name: "Iterative Two-Pointer State Transition",
                timeComplexity: "O(N)",
                timeExplanation: "Generates each of the N terms in a single linear pass.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two state registers (a and b) tracking consecutive Fibonacci terms.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long a = 0, b = 1;\n        for (int i = 0; i < n; i++) {\n            System.out.print(a + (i == n - 1 ? \"\" : \" \"));\n            long next = a + b;\n            a = b;\n            b = next;\n        }\n        System.out.println();\n    }\n}",
                steps: [
                    {
                        title: "Initialize Base Terms: a = 0, b = 1 (N = 7)",
                        what: "Input N = 7. Initialize first two terms: a = 0, b = 1.",
                        why: "Every Fibonacci number is the sum of the two preceding ones: F(n) = F(n-1) + F(n-2).",
                        variables: {"a": 0, "b": 1, "n": 7},
                        takeaway: "0 and 1 are the universal foundational seeds of the Fibonacci sequence.",
                        javaLine: 7,
                        render: () => H.registers('Fibonacci Seed Registers', [{name:'a (Term 0)', val:'0', active:true}, {name:'b (Term 1)', val:'1', active:true}], 'Seeds: F(0) = 0, F(1) = 1')
                    },
                    {
                        title: "State Shift 1 & 2: Output '0 1 1 2'",
                        what: "i=0: Print 0, next=0+1=1, a=1, b=1. i=1: Print 1, next=1+1=2, a=1, b=2. i=2: Print 1, next=1+2=3, a=2, b=3.",
                        why: "Registers a and b slide forward like a 2-element moving window.",
                        variables: {"Emitted Terms": "'0 1 1 2'", "a": 2, "b": 3},
                        takeaway: "Only 2 memory slots needed instead of storing an entire array.",
                        javaLine: 9,
                        render: () => H.pipeline('Sliding State Progression', [{label:'Print a=0', val:'F(0)=0'}, {label:'Print a=1', val:'F(1)=1'}, {label:'Print a=1', val:'F(2)=1'}, {label:'Print a=2', val:'F(3)=2', success:true}])
                    },
                    {
                        title: "Complete Sequence to N = 7: '0 1 1 2 3 5 8'",
                        what: "Continue iterations up to i=6: Print 3, 5, 8. Final sequence: 0 1 1 2 3 5 8.",
                        why: "7 terms generated cleanly separated by spaces.",
                        variables: {"Output": "'0 1 1 2 3 5 8'", "Total Terms": 7},
                        takeaway: "Fibonacci sequence generated in O(N) time and O(1) space.",
                        javaLine: 14,
                        render: () => H.array('Generated Fibonacci Terms', [0, 1, 1, 2, 3, 5, 8], [0, 1, 2, 3, 4, 5, 6], {6: {name:'N=7', cls:'pin-success'}}, 'First 7 terms: 0 1 1 2 3 5 8')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['20'] = anim_20_fibonacci_series;
    BASIC_ANIMATIONS['fibonacci-series'] = anim_20_fibonacci_series;

    const anim_21_reverse_a_number = {
        id: 21,
        title: "Reverse a Number",
        canonicalId: "reverse-a-number",
        category: "Number Problems",
        approaches: [
            {
                id: "math-reverse",
                name: "Mathematical Modulo & Decimal Accumulation",
                timeComplexity: "O(log10 N)",
                timeExplanation: "Extracts one decimal digit per loop step in O(digits) time.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two integer registers (n and rev).",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long rev = 0;\n        while (n > 0) {\n            long rem = n % 10;\n            rev = rev * 10 + rem;\n            n /= 10;\n        }\n        System.out.println(rev);\n    }\n}",
                steps: [
                    {
                        title: "Initial Input & Accumulator Setup (N = 12345)",
                        what: "Read integer N = 12345. Initialize reversed accumulator rev = 0.",
                        why: "Decimal number system allows extraction of the last digit via n % 10 and shifting rev via rev * 10.",
                        variables: {"n": 12345, "rev": 0},
                        takeaway: "No string conversion required; pure arithmetic prevents heap allocation overhead.",
                        javaLine: 7,
                        render: () => H.registers('Initial State', [{name:'n', val:'12345', active:true}, {name:'rev', val:'0'}], 'Starting arithmetic reversal for 12345')
                    },
                    {
                        title: "Iteration 1 & 2: Extract 5, then 4",
                        what: "Step 1: rem = 12345 % 10 = 5. rev = 0 * 10 + 5 = 5. n becomes 1234. Step 2: rem = 4. rev = 5 * 10 + 4 = 54. n becomes 123.",
                        why: "Multiplying rev by 10 creates an empty ones place for the newly extracted digit.",
                        variables: {"n": 123, "rev": 54},
                        takeaway: "Reversed digits accumulate from most significant to least significant in rev.",
                        javaLine: 9,
                        render: () => H.pipeline('Digit Shift Progress', [{label:'Extract 5', val:'rev = 5'}, {label:'Extract 4', val:'rev = 54', active:true}, {label:'Remaining n', val:'123'}])
                    },
                    {
                        title: "Exhaust Remaining Digits: Final rev = 54321",
                        what: "Process 3 -> rev = 543. Process 2 -> rev = 5432. Process 1 -> rev = 54321. n drops to 0, loop terminates.",
                        why: "When n == 0, all decimal positions have transferred into rev.",
                        variables: {"n": 0, "rev": 54321, "Output": 54321},
                        takeaway: "Original 12345 is mathematically transformed into 54321.",
                        javaLine: 12,
                        render: () => H.registers('Reversal Complete', [{name:'Final n', val:'0'}, {name:'Reversed (rev)', val:'54321', done:true}], 'All digits reversed: 54321')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['21'] = anim_21_reverse_a_number;
    BASIC_ANIMATIONS['reverse-a-number'] = anim_21_reverse_a_number;

    const anim_22_number_palindrome = {
        id: 22,
        title: "Palindrome Number Checker",
        canonicalId: "number-palindrome",
        category: "Number Problems",
        approaches: [
            {
                id: "reverse-compare",
                name: "Mathematical Reverse & Equality Test",
                timeComplexity: "O(log10 N)",
                timeExplanation: "Computes arithmetic reverse and compares with saved original in 1 pass.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores original, copy, and rev in scalar registers.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        if (n < 0) {\n            System.out.println(\"Not Palindrome\");\n            return;\n        }\n        long original = n;\n        long rev = 0;\n        while (n > 0) {\n            rev = rev * 10 + (n % 10);\n            n /= 10;\n        }\n        System.out.println(original == rev ? \"Palindrome\" : \"Not Palindrome\");\n    }\n}",
                steps: [
                    {
                        title: "Save Original Copy (n = 1221)",
                        what: "Read integer n = 1221. Save copy: original = 1221. Initialize rev = 0.",
                        why: "Because digit extraction mutates n to 0, saving original is essential for final comparison.",
                        variables: {"n": 1221, "original": 1221, "rev": 0},
                        takeaway: "Negative numbers can never be palindromes due to the leading minus sign.",
                        javaLine: 11,
                        render: () => H.registers('State Preservation', [{name:'original', val:'1221', highlight:true}, {name:'n (mutating)', val:'1221'}, {name:'rev', val:'0'}], 'Saved original = 1221')
                    },
                    {
                        title: "Extract and Reverse Digits: rev = 1221",
                        what: "Digit stream extracts: 1, 2, 2, 1. rev becomes 1 -> 12 -> 122 -> 1221. n reaches 0.",
                        why: "Standard mathematical reversal reverses the sequence of digits.",
                        variables: {"n": 0, "rev": 1221, "original": 1221},
                        takeaway: "rev reconstructs the number in reverse reading order.",
                        javaLine: 13,
                        render: () => H.comp('Reversal Outcome', 'original', 'vs rev', '1221', '1221', true)
                    },
                    {
                        title: "Equality Comparison: (1221 == 1221)",
                        what: "Evaluate original == rev: 1221 == 1221 is TRUE. Output: 'Palindrome'.",
                        why: "Since the forward number equals the backward number, it satisfies the palindrome definition.",
                        variables: {"original": 1221, "rev": 1221, "Verdict": "'Palindrome'"},
                        takeaway: "Number reads symmetrically forwards and backwards.",
                        javaLine: 17,
                        render: () => H.pipeline('Palindrome Verification', [{label:'Original Copy', val:'1221'}, {label:'Reversed Value', val:'1221'}, {label:'Verdict', val:'Palindrome', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['22'] = anim_22_number_palindrome;
    BASIC_ANIMATIONS['number-palindrome'] = anim_22_number_palindrome;

    const anim_23_armstrong_number = {
        id: 23,
        title: "Armstrong Number Validator",
        canonicalId: "armstrong-number",
        category: "Number Problems",
        approaches: [
            {
                id: "power-sum",
                name: "Digit Power Summation (k Digits)",
                timeComplexity: "O(log10 N)",
                timeExplanation: "Counts digits (k), then raises each digit to power k and sums them.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores original, digit count k, and accumulator sum.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long original = n;\n        int k = String.valueOf(n).length();\n        long sum = 0;\n        long temp = n;\n        while (temp > 0) {\n            long d = temp % 10;\n            long p = 1;\n            for (int i = 0; i < k; i++) p *= d;\n            sum += p;\n            temp /= 10;\n        }\n        System.out.println(sum == original ? \"Armstrong\" : \"Not Armstrong\");\n    }\n}",
                steps: [
                    {
                        title: "Determine Digit Count k (N = 153)",
                        what: "Input N = 153. Digits count k = 3. We must verify if: 1\u00b3 + 5\u00b3 + 3\u00b3 == 153.",
                        why: "An Armstrong number of k digits equals the sum of its digits each raised to power k.",
                        variables: {"n": 153, "k (digits)": 3, "Formula": "d\u2081\u00b3 + d\u2082\u00b3 + d\u2083\u00b3 == 153"},
                        takeaway: "For 3-digit numbers, each digit is cubed.",
                        javaLine: 8,
                        render: () => H.registers('Armstrong Target Verification', [{name:'n', val:'153'}, {name:'k (Power)', val:'3', active:true}], 'Checking 1³ + 5³ + 3³ == 153')
                    },
                    {
                        title: "Calculate Digit Powers: 1\u00b3, 5\u00b3, 3\u00b3",
                        what: "Digit 3: 3\u00b3 = 27. Digit 5: 5\u00b3 = 125. Digit 1: 1\u00b3 = 1.",
                        why: "Each extracted digit is raised to the k-th power independently.",
                        variables: {"3\u00b3": 27, "5\u00b3": 125, "1\u00b3": 1},
                        takeaway: "27 + 125 + 1 = 153.",
                        javaLine: 14,
                        render: () => H.pipeline('Digit Powers Computation', [{label:'3³', val:'27'}, {label:'5³', val:'125'}, {label:'1³', val:'1', active:true}])
                    },
                    {
                        title: "Sum Comparison: 153 == 153",
                        what: "Accumulate sum: 27 + 125 + 1 = 153. Compare sum (153) == original (153): Match! Output: 'Armstrong'.",
                        why: "Sum of cubed digits exactly reproduces the original integer 153.",
                        variables: {"sum": 153, "original": 153, "Verdict": "'Armstrong'"},
                        takeaway: "153, 370, 371, and 407 are classic 3-digit Armstrong numbers.",
                        javaLine: 18,
                        render: () => H.pipeline('Armstrong Verdict', [{label:'Sum of Powers', val:'153'}, {label:'Original Number', val:'153'}, {label:'Verdict', val:'Armstrong', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['23'] = anim_23_armstrong_number;
    BASIC_ANIMATIONS['armstrong-number'] = anim_23_armstrong_number;

    const anim_24_gcd_and_lcm = {
        id: 24,
        title: "GCD and LCM of Two Numbers",
        canonicalId: "gcd-and-lcm",
        category: "Number Problems",
        approaches: [
            {
                id: "euclidean-algo",
                name: "Euclidean Modulo Algorithm & Product Formula",
                timeComplexity: "O(log(min(A, B)))",
                timeExplanation: "Euclidean remainder reduces operands exponentially by at least half every two steps.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores original operands and remainder registers.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        long origA = a, origB = b;\n        while (b != 0) {\n            long rem = a % b;\n            a = b;\n            b = rem;\n        }\n        long gcd = a;\n        long lcm = (origA * origB) / gcd;\n        System.out.println(gcd + \" \" + lcm);\n    }\n}",
                steps: [
                    {
                        title: "Input Operands (A = 24, B = 36)",
                        what: "Read A = 24, B = 36. Save copies origA = 24, origB = 36 to compute LCM later.",
                        why: "LCM formula: LCM(a, b) = (a * b) / GCD(a, b).",
                        variables: {"a": 24, "b": 36, "origA": 24, "origB": 36},
                        takeaway: "Euclid's algorithm calculates GCD through repeated modulo operations.",
                        javaLine: 8,
                        render: () => H.registers('Euclidean Setup', [{name:'a', val:'24'}, {name:'b', val:'36'}, {name:'origA*origB', val:'864'}], 'Inputs: 24 and 36')
                    },
                    {
                        title: "Euclidean Modulo Iterations",
                        what: "Step 1: 24 % 36 = 24 -> a=36, b=24. Step 2: 36 % 24 = 12 -> a=24, b=12. Step 3: 24 % 12 = 0 -> a=12, b=0.",
                        why: "When b reaches 0, the remaining non-zero value in a is the GCD.",
                        variables: {"GCD": 12, "Final a": 12, "Final b": 0},
                        takeaway: "GCD of 24 and 36 is 12.",
                        javaLine: 10,
                        render: () => H.pipeline('Euclidean Reduction', [{label:'36 % 24', val:'rem = 12'}, {label:'24 % 12', val:'rem = 0 (Done!)', success:true}, {label:'GCD', val:'12', success:true}])
                    },
                    {
                        title: "LCM Computation: (24 * 36) / 12 = 72",
                        what: "Compute LCM: (origA * origB) / GCD = 864 / 12 = 72. Output: '12 72'.",
                        why: "Because GCD contains all shared prime factors, dividing the product by GCD yields the least common multiple.",
                        variables: {"GCD": 12, "LCM": 72, "Output": "'12 72'"},
                        takeaway: "Both fundamental mathematical relations resolved in logarithmic time.",
                        javaLine: 16,
                        render: () => H.pipeline('Final Output: GCD and LCM', [{label:'GCD', val:'12', success:true}, {label:'LCM', val:'72', success:true}, {label:'Console', val:'12 72', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['24'] = anim_24_gcd_and_lcm;
    BASIC_ANIMATIONS['gcd-and-lcm'] = anim_24_gcd_and_lcm;

    const anim_25_right_triangle_star_pattern = {
        id: 25,
        title: "Right Triangle Star Pattern",
        canonicalId: "right-triangle-star-pattern",
        category: "Pattern Programming",
        approaches: [
            {
                id: "nested-loops-asc",
                name: "Ascending Nested For-Loops",
                timeComplexity: "O(N\u00b2)",
                timeExplanation: "Outer loop runs N times; inner loop runs 1 + 2 + ... + N = N(N+1)/2 times.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two loop index registers (i and j).",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print(\"*\");\n            }\n            System.out.println();\n        }\n    }\n}",
                steps: [
                    {
                        title: "Pattern Setup (N = 4 Rows)",
                        what: "Target: Print right-angled triangle of height N = 4. Row i contains exactly i asterisks.",
                        why: "Row index i controls the upper bound of inner loop j.",
                        variables: {"N": 4, "i": 1, "j": 1},
                        takeaway: "Outer loop dictates row count; inner loop dictates character count per row.",
                        javaLine: 7,
                        render: () => H.pattern('Triangle Pattern (Height 4)', ['*', '', '', ''], 0)
                    },
                    {
                        title: "Print Rows 1 and 2",
                        what: "Row 1 (i=1): 1 star -> '*'. Row 2 (i=2): 2 stars -> '**'.",
                        why: "Inner loop j runs from 1 to i for each row.",
                        variables: {"Row 1": "'*'", "Row 2": "'**'"},
                        takeaway: "Each successive row prints 1 additional star.",
                        javaLine: 8,
                        render: () => H.pattern('Row 1 and 2 Complete', ['*', '**', '', ''], 1)
                    },
                    {
                        title: "Complete Rows 3 and 4 \u2014 Final Triangle",
                        what: "Row 3 (i=3): '***'. Row 4 (i=4): '****'. Outer loop terminates.",
                        why: "All 4 rows printed cleanly with newline after each row.",
                        variables: {"Total Stars": "1+2+3+4 = 10", "Status": "COMPLETED"},
                        takeaway: "Triangular number of stars: 4 * 5 / 2 = 10 stars total.",
                        javaLine: 11,
                        render: () => H.pattern('Full Right Triangle Complete', ['*', '**', '***', '****'], 3)
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['25'] = anim_25_right_triangle_star_pattern;
    BASIC_ANIMATIONS['right-triangle-star-pattern'] = anim_25_right_triangle_star_pattern;

    const anim_26_inverted_triangle_pattern = {
        id: 26,
        title: "Inverted Triangle Pattern",
        canonicalId: "inverted-triangle-pattern",
        category: "Pattern Programming",
        approaches: [
            {
                id: "nested-loops-desc",
                name: "Descending Nested Loops",
                timeComplexity: "O(N\u00b2)",
                timeExplanation: "Outer loop decrements from N down to 1, printing N + (N-1) + ... + 1 stars.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two integer loop counters.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = n; i >= 1; i--) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print(\"*\");\n            }\n            System.out.println();\n        }\n    }\n}",
                steps: [
                    {
                        title: "Row 1 (i = 4): Print 4 Stars",
                        what: "Outer loop starts at i = 4. Inner loop prints 4 stars: '****'.",
                        why: "Inverted triangle starts with maximum width and tapers down to 1.",
                        variables: {"i": 4, "stars in row": 4},
                        takeaway: "Counting outer loop down (i--) creates a decreasing row sequence.",
                        javaLine: 7,
                        render: () => H.pattern('Row 1: 4 Stars (i=4)', ['****', '', '', ''], 0)
                    },
                    {
                        title: "Rows 2 and 3: Print 3 Stars, then 2 Stars",
                        what: "Row 2 (i=3): '***'. Row 3 (i=2): '**'.",
                        why: "Each row decrements star count by 1.",
                        variables: {"Row 2": "'***'", "Row 3": "'**'"},
                        takeaway: "Downward slope visually inverts the triangle geometry.",
                        javaLine: 8,
                        render: () => H.pattern('Row 2 and 3 Complete', ['****', '***', '**', ''], 2)
                    },
                    {
                        title: "Row 4 (i = 1): Print 1 Star \u2014 Completed",
                        what: "Row 4 prints final single star: '*'. Next step i=0 terminates loop.",
                        why: "Base case reached when i = 1.",
                        variables: {"Row 4": "'*'", "Total Rows": 4},
                        takeaway: "Inverted triangle generated with clean row-by-row flushing.",
                        javaLine: 11,
                        render: () => H.pattern('Inverted Triangle Complete', ['****', '***', '**', '*'], 3)
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['26'] = anim_26_inverted_triangle_pattern;
    BASIC_ANIMATIONS['inverted-triangle-pattern'] = anim_26_inverted_triangle_pattern;

    const anim_27_number_pyramid = {
        id: 27,
        title: "Number Pyramid",
        canonicalId: "number-pyramid",
        category: "Pattern Programming",
        approaches: [
            {
                id: "nested-number-seq",
                name: "Sequential Integer Inner Loop",
                timeComplexity: "O(N\u00b2)",
                timeExplanation: "Prints numbers 1 to i for each row i from 1 to N.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two loop index registers.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print(j + (j == i ? \"\" : \" \"));\n            }\n            System.out.println();\n        }\n    }\n}",
                steps: [
                    {
                        title: "Initialize Pyramid (N = 4 Rows)",
                        what: "Target: Print numbers 1..i separated by spaces in row i.",
                        why: "Instead of static asterisks, inner loop prints counter j directly.",
                        variables: {"N": 4, "i": 1, "j": 1},
                        takeaway: "Using the inner loop variable j directly generates ascending sequences.",
                        javaLine: 7,
                        render: () => H.pattern('Pyramid Row 1', ['1', '', '', ''], 0)
                    },
                    {
                        title: "Rows 1, 2, and 3 Progression",
                        what: "Row 1: '1'. Row 2: '1 2'. Row 3: '1 2 3'.",
                        why: "At row i, j counts from 1 up to i.",
                        variables: {"Row 1": "'1'", "Row 2": "'1 2'", "Row 3": "'1 2 3'"},
                        takeaway: "Inner loop variable j resets to 1 at the beginning of every row.",
                        javaLine: 8,
                        render: () => H.pattern('Rows 1 to 3', ['1', '1 2', '1 2 3', ''], 2)
                    },
                    {
                        title: "Row 4: '1 2 3 4' \u2014 Pyramid Finished",
                        what: "Final row prints: '1 2 3 4'. Loop terminates.",
                        why: "All 4 pyramid tiers complete.",
                        variables: {"Row 4": "'1 2 3 4'", "Status": "COMPLETED"},
                        takeaway: "Clean numeric pyramid structure verified.",
                        javaLine: 11,
                        render: () => H.pattern('Number Pyramid Complete', ['1', '1 2', '1 2 3', '1 2 3 4'], 3)
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['27'] = anim_27_number_pyramid;
    BASIC_ANIMATIONS['number-pyramid'] = anim_27_number_pyramid;

    const anim_28_floyds_triangle = {
        id: 28,
        title: "Floyd's Triangle",
        canonicalId: "floyds-triangle",
        category: "Pattern Programming",
        approaches: [
            {
                id: "global-counter",
                name: "Sequential Monotonic Counter Matrix",
                timeComplexity: "O(N\u00b2)",
                timeExplanation: "Prints N(N+1)/2 consecutive integers.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores running counter num and loop indices.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int num = 1;\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= i; j++) {\n                System.out.print(num + (j == i ? \"\" : \" \"));\n                num++;\n            }\n            System.out.println();\n        }\n    }\n}",
                steps: [
                    {
                        title: "Global Counter Initialization (num = 1)",
                        what: "Initialize sequential counter num = 1 outside all loops. N = 4 rows.",
                        why: "Because num is not reset per row, it increases monotonically across the entire triangle.",
                        variables: {"num": 1, "N": 4},
                        takeaway: "Persistence across inner loop iterations allows numbers to fill rows continuously.",
                        javaLine: 7,
                        render: () => H.pattern('Floyd Row 1: num = 1', ['1', '', '', ''], 0)
                    },
                    {
                        title: "Rows 1 and 2: '1', then '2 3'",
                        what: "Row 1 (1 element): prints 1 (num becomes 2). Row 2 (2 elements): prints 2, 3 (num becomes 4).",
                        why: "num increments after every printed cell.",
                        variables: {"Row 1": "'1'", "Row 2": "'2 3'", "num": 4},
                        takeaway: "Total numbers in row i equals i.",
                        javaLine: 9,
                        render: () => H.pattern('Rows 1 and 2 Complete', ['1', '2 3', '', ''], 1)
                    },
                    {
                        title: "Complete Rows 3 and 4: 1 to 10",
                        what: "Row 3: prints 4 5 6. Row 4: prints 7 8 9 10. All 10 natural numbers placed.",
                        why: "Row 4 prints elements when num ranges from 7 to 10.",
                        variables: {"Final num": 11, "Total Numbers": 10},
                        takeaway: "Floyd's triangle elegantly packs consecutive numbers into triangular rows.",
                        javaLine: 13,
                        render: () => H.pattern("Floyd's Triangle Complete", ['1', '2 3', '4 5 6', '7 8 9 10'], 3)
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['28'] = anim_28_floyds_triangle;
    BASIC_ANIMATIONS['floyds-triangle'] = anim_28_floyds_triangle;

    const anim_29_array_sum_and_average = {
        id: 29,
        title: "Array Sum and Average",
        canonicalId: "array-sum-and-average",
        category: "Arrays",
        approaches: [
            {
                id: "linear-scan",
                name: "Linear Array Traversal & Accumulation",
                timeComplexity: "O(N)",
                timeExplanation: "Single pass through array of N elements to compute total sum.",
                spaceComplexity: "O(N)",
                spaceExplanation: "Stores input elements in an integer array of size N.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long sum = 0;\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n            sum += arr[i];\n        }\n        double avg = (double) sum / n;\n        System.out.println(sum);\n        System.out.printf(\"%.2f\\n\", avg);\n    }\n}",
                steps: [
                    {
                        title: "Input Array Allocation: [10, 20, 30, 40, 50]",
                        what: "Read N = 5. Allocate contiguous memory array: [10, 20, 30, 40, 50]. Initialize sum = 0.",
                        why: "Array indices range from 0 to N-1.",
                        variables: {"N": 5, "sum": 0, "arr": "[10, 20, 30, 40, 50]"},
                        takeaway: "Arrays provide O(1) random memory access via index indexing.",
                        javaLine: 8,
                        render: () => H.array('Input Array Allocation', [10, 20, 30, 40, 50], [], {0: {name:'i=0', cls:'pin-primary'}}, 'Array loaded into heap memory')
                    },
                    {
                        title: "Accumulate Elements: sum = 150",
                        what: "Traverse indices 0..4: 10 + 20 + 30 + 40 + 50 = 150.",
                        why: "Each iteration adds arr[i] to accumulator sum.",
                        variables: {"sum": 150, "Elements Processed": 5},
                        takeaway: "Linear traversal visits each memory address exactly once.",
                        javaLine: 10,
                        render: () => H.array('Array Traversal Complete', [10, 20, 30, 40, 50], [0, 1, 2, 3, 4], {4: {name:'sum=150', cls:'pin-success'}}, 'All 5 elements accumulated')
                    },
                    {
                        title: "Compute Average: 150 / 5 = 30.00",
                        what: "Compute average: (double) 150 / 5 = 30.00. Output sum on line 1, avg on line 2.",
                        why: "Casting sum to double prevents integer truncation during division.",
                        variables: {"sum": 150, "avg": "30.00", "Output": "'150\\n30.00'"},
                        takeaway: "Sum = 150, Average = 30.00.",
                        javaLine: 13,
                        render: () => H.pipeline('Output Metrics', [{label:'Array Size N', val:'5'}, {label:'Total Sum', val:'150', success:true}, {label:'Mean Average', val:'30.00', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['29'] = anim_29_array_sum_and_average;
    BASIC_ANIMATIONS['array-sum-and-average'] = anim_29_array_sum_and_average;

    const anim_30_find_maximum_and_minimum = {
        id: 30,
        title: "Find Maximum and Minimum in Array",
        canonicalId: "find-maximum-and-minimum",
        category: "Arrays",
        approaches: [
            {
                id: "single-pass-minmax",
                name: "Single-Pass Dual Extreme Tracking",
                timeComplexity: "O(N)",
                timeExplanation: "Compares each of the N elements against current min and max in 1 pass.",
                spaceComplexity: "O(N)",
                spaceExplanation: "Stores input array.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int max = arr[0], min = arr[0];\n        for (int i = 1; i < n; i++) {\n            if (arr[i] > max) max = arr[i];\n            if (arr[i] < min) min = arr[i];\n        }\n        System.out.println(max + \" \" + min);\n    }\n}",
                steps: [
                    {
                        title: "Initialize Extremes with arr[0] = 45",
                        what: "Input array: [45, 12, 89, 23, 67]. Initialize max = 45 and min = 45.",
                        why: "Seeding with the first element guarantees that extremes are valid values from the dataset.",
                        variables: {"max": 45, "min": 45, "i": 0},
                        takeaway: "Never initialize with arbitrary magic numbers like 0 if negative inputs are possible.",
                        javaLine: 9,
                        render: () => H.array('Array: [45, 12, 89, 23, 67]', [45, 12, 89, 23, 67], [0], {0: {name:'Seed', cls:'pin-primary'}}, 'max = 45, min = 45')
                    },
                    {
                        title: "Inspect 12 (New min) and 89 (New max)",
                        what: "At idx 1: 12 < 45 -> min = 12. At idx 2: 89 > 45 -> max = 89.",
                        why: "Extremes update dynamically whenever an element beats either bound.",
                        variables: {"min": 12, "max": 89, "i": 2},
                        takeaway: "A single element cannot simultaneously update both min and max unless N=1.",
                        javaLine: 11,
                        render: () => H.array('Extremes Updated: min=12, max=89', [45, 12, 89, 23, 67], [1, 2], {1: {name:'min=12', cls:'pin-warning'}, 2: {name:'max=89', cls:'pin-success'}}, 'min updated to 12, max updated to 89')
                    },
                    {
                        title: "Inspect Remaining Elements: Final max = 89, min = 12",
                        what: "Inspect 23 and 67: neither is < 12 or > 89. Array exhausted. Output: '89 12'.",
                        why: "All elements verified in a single pass of N-1 comparisons.",
                        variables: {"max": 89, "min": 12, "Output": "'89 12'"},
                        takeaway: "Global maximum is 89; global minimum is 12.",
                        javaLine: 15,
                        render: () => H.registers('Final Extremes', [{name:'Maximum', val:'89', done:true}, {name:'Minimum', val:'12', done:true}], 'Output: 89 12')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['30'] = anim_30_find_maximum_and_minimum;
    BASIC_ANIMATIONS['find-maximum-and-minimum'] = anim_30_find_maximum_and_minimum;

    const anim_31_second_largest_element = {
        id: 31,
        title: "Second Largest Element in Array",
        canonicalId: "second-largest-element",
        category: "Arrays",
        approaches: [
            {
                id: "single-pass-second",
                name: "Single-Pass Dual Variable Tracking",
                timeComplexity: "O(N)",
                timeExplanation: "Scans array once maintaining first and second distinct maximums.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two integer state variables (first and second).",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;\n        for (int x : arr) {\n            if (x > first) {\n                second = first;\n                first = x;\n            } else if (x > second && x < first) {\n                second = x;\n            }\n        }\n        System.out.println(second == Integer.MIN_VALUE ? -1 : second);\n    }\n}",
                steps: [
                    {
                        title: "Initialize Dual Trackers (Array: [10, 50, 20, 50, 30])",
                        what: "Load array: [10, 50, 20, 50, 30]. Initialize first = MIN, second = MIN.",
                        why: "We must find the second strictly distinct largest element without sorting.",
                        variables: {"first": "MIN", "second": "MIN", "arr": "[10, 50, 20, 50, 30]"},
                        takeaway: "Sorting would take O(N log N); dual tracking achieves optimal O(N) linear time.",
                        javaLine: 9,
                        render: () => H.array('Array: [10, 50, 20, 50, 30]', [10, 50, 20, 50, 30], [], {}, 'Trackers: first = MIN, second = MIN')
                    },
                    {
                        title: "Process 10 and 50",
                        what: "x = 10: first becomes 10. x = 50: 50 > 10, so second = first (10), and first = 50.",
                        why: "When a new global maximum appears, the old maximum drops down to become the new second maximum.",
                        variables: {"first": 50, "second": 10, "x": 50},
                        takeaway: "Cascading assignment preserves the previous highest value.",
                        javaLine: 11,
                        render: () => H.registers('State after 50', [{name:'first (Max)', val:'50', done:true}, {name:'second', val:'10', active:true}], '50 displaced 10 to second position')
                    },
                    {
                        title: "Process 20, Duplicate 50, and 30",
                        what: "x = 20: 20 > 10 and < 50 -> second = 20. x = 50: duplicate ignored (x < first fails). x = 30: 30 > 20 and < 50 -> second = 30.",
                        why: "Strict inequality (x < first) rejects duplicate occurrences of the maximum.",
                        variables: {"first": 50, "second": 30, "Output": 30},
                        takeaway: "Final second distinct largest element is 30.",
                        javaLine: 14,
                        render: () => H.registers('Final Result', [{name:'Largest (first)', val:'50'}, {name:'Second Largest', val:'30', done:true}], 'Output: 30 (distinct from 50)')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['31'] = anim_31_second_largest_element;
    BASIC_ANIMATIONS['second-largest-element'] = anim_31_second_largest_element;

    const anim_32_reverse_an_array = {
        id: 32,
        title: "Reverse an Array in Place",
        canonicalId: "reverse-an-array",
        category: "Arrays",
        approaches: [
            {
                id: "two-pointers-swap",
                name: "Two-Pointer Symmetric Swapping",
                timeComplexity: "O(N)",
                timeExplanation: "N/2 swaps symmetrically mirroring elements around array center.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Reverses directly in-place inside the existing array buffer.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int left = 0, right = n - 1;\n        while (left < right) {\n            int temp = arr[left];\n            arr[left] = arr[right];\n            arr[right] = temp;\n            left++;\n            right--;\n        }\n        for (int i = 0; i < n; i++) System.out.print(arr[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
                steps: [
                    {
                        title: "Initialize Boundary Pointers: left = 0, right = 4",
                        what: "Array: [1, 2, 3, 4, 5]. Pointer left = 0 (val: 1), pointer right = 4 (val: 5).",
                        why: "Opposite ends of array are swapped first, gradually moving inward.",
                        variables: {"left": 0, "right": 4, "arr": "[1, 2, 3, 4, 5]"},
                        takeaway: "In-place algorithms modify memory directly without auxiliary buffers.",
                        javaLine: 9,
                        render: () => H.array('Initial Array [1, 2, 3, 4, 5]', [1, 2, 3, 4, 5], [0, 4], {0: {name:'L=0', cls:'pin-primary'}, 4: {name:'R=4', cls:'pin-secondary'}}, 'Left at 0, Right at 4')
                    },
                    {
                        title: "Swap Outer Pair: arr[0] <-> arr[4]",
                        what: "Swap 1 and 5. Array becomes [5, 2, 3, 4, 1]. Increment left to 1, decrement right to 3.",
                        why: "Outer boundary is now reversed. Pointers converge inward by 1 position.",
                        variables: {"arr[0]": 5, "arr[4]": 1, "left": 1, "right": 3},
                        takeaway: "Convergence rate is 2 elements per iteration.",
                        javaLine: 11,
                        render: () => H.array('After 1st Swap: [5, 2, 3, 4, 1]', [5, 2, 3, 4, 1], [1, 3], {1: {name:'L=1', cls:'pin-primary'}, 3: {name:'R=3', cls:'pin-secondary'}}, 'Swapped 1 and 5')
                    },
                    {
                        title: "Swap Inner Pair: arr[1] <-> arr[3] \u2014 Completed",
                        what: "Swap 2 and 4. Array becomes [5, 4, 3, 2, 1]. left=2 and right=2 meet at center (3). Loop terminates.",
                        why: "When left >= right, all symmetrical pairs have been exchanged.",
                        variables: {"arr": "[5, 4, 3, 2, 1]", "Final Output": "'5 4 3 2 1'"},
                        takeaway: "Array reversed in-place in exactly 2 swaps.",
                        javaLine: 17,
                        render: () => H.array('Fully Reversed: [5, 4, 3, 2, 1]', [5, 4, 3, 2, 1], [0, 1, 2, 3, 4], {2: {name:'Center', cls:'pin-success'}}, 'In-place reversal complete')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['32'] = anim_32_reverse_an_array;
    BASIC_ANIMATIONS['reverse-an-array'] = anim_32_reverse_an_array;

    const anim_33_reverse_a_string_basic = {
        id: 33,
        title: "Reverse a String",
        canonicalId: "reverse-a-string-basic",
        category: "Strings",
        approaches: [
            {
                id: "char-inversion",
                name: "Two-Pointer In-Place Character Reversal",
                timeComplexity: "O(L)",
                timeExplanation: "L/2 character swaps on underlying char array of length L.",
                spaceComplexity: "O(L)",
                spaceExplanation: "Converts immutable Java String into mutable char[] array.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        char[] ch = s.toCharArray();\n        int l = 0, r = ch.length - 1;\n        while (l < r) {\n            char temp = ch[l];\n            ch[l] = ch[r];\n            ch[r] = temp;\n            l++;\n            r--;\n        }\n        System.out.println(new String(ch));\n    }\n}",
                steps: [
                    {
                        title: "Convert Immutable String to char[] ('CodeArena')",
                        what: "Input: 'CodeArena' (length 9). Convert to mutable character array: ['C','o','d','e','A','r','e','n','a'].",
                        why: "Java strings are immutable; modifying characters requires a char[] or StringBuilder.",
                        variables: {"s": "'CodeArena'", "Length": 9, "l": 0, "r": 8},
                        takeaway: "toCharArray() allocates a mutable contiguous character buffer.",
                        javaLine: 7,
                        render: () => H.array('Mutable char[] Buffer', ['C','o','d','e','A','r','e','n','a'], [0, 8], {0: {name:'l=0', cls:'pin-primary'}, 8: {name:'r=8', cls:'pin-secondary'}}, 'Left at C, Right at a')
                    },
                    {
                        title: "Swap Symmetrical Character Pairs",
                        what: "Swap 'C' <-> 'a' -> 'aodeArenC'. Swap 'o' <-> 'n' -> 'andeAroC'. Swap 'd' <-> 'e' -> 'anerAdoC'. Swap 'e' <-> 'r' -> 'anerAedoC'.",
                        why: "Converging pointers symmetrically invert the character positions.",
                        variables: {"Swaps": "4 total swaps", "l": 4, "r": 4},
                        takeaway: "The middle character 'A' at index 4 remains in its position.",
                        javaLine: 10,
                        render: () => H.array('Reversed char[] Array', ['a','n','e','r','A','e','d','o','C'], [0, 1, 2, 3, 5, 6, 7, 8], {4: {name:'Pivot A', cls:'pin-warning'}}, '4 symmetrical swaps complete')
                    },
                    {
                        title: "Reconstruct String: 'anerAedoC'",
                        what: "Convert char[] back to String: 'anerAedoC'. Print to console.",
                        why: "Creates new String instance from the inverted character array.",
                        variables: {"Reversed String": "'anerAedoC'", "Output": "'anerAedoC'"},
                        takeaway: "Reversed output matches expected string exactly.",
                        javaLine: 17,
                        render: () => H.pipeline('String Reversal Complete', [{label:'Input String', val:'CodeArena'}, {label:'char[] Inversion', val:'4 swaps', success:true}, {label:'Output String', val:'anerAedoC', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['33'] = anim_33_reverse_a_string_basic;
    BASIC_ANIMATIONS['reverse-a-string-basic'] = anim_33_reverse_a_string_basic;

    const anim_34_count_vowels_and_consonants = {
        id: 34,
        title: "Count Vowels and Consonants",
        canonicalId: "count-vowels-and-consonants",
        category: "Strings",
        approaches: [
            {
                id: "char-classification",
                name: "Sequential Character Classification",
                timeComplexity: "O(L)",
                timeExplanation: "Examines each character of length L once in a linear pass.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two counter registers (vowels and consonants).",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next().toLowerCase();\n        int vowels = 0, consonants = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c >= 'a' && c <= 'z') {\n                if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {\n                    vowels++;\n                } else {\n                    consonants++;\n                }\n            }\n        }\n        System.out.printf(\"Vowels: %d, Consonants: %d\\n\", vowels, consonants);\n    }\n}",
                steps: [
                    {
                        title: "Normalize String to Lowercase ('javaprogramming')",
                        what: "Input: 'JavaProgramming'. Normalize via toLowerCase(): 'javaprogramming'. Length = 15.",
                        why: "Lowercasing eliminates case-sensitive branch checks (A vs a).",
                        variables: {"s": "'javaprogramming'", "vowels": 0, "consonants": 0},
                        takeaway: "Vowels set: {'a', 'e', 'i', 'o', 'u'}; all other alphabetic letters are consonants.",
                        javaLine: 6,
                        render: () => H.registers('Initial Counters', [{name:'Vowels', val:'0'}, {name:'Consonants', val:'0'}, {name:'Normalized', val:'"javaprogramming"'}], 'Scanning 15 characters')
                    },
                    {
                        title: "Scan and Tally Characters",
                        what: "Identify vowels: 'a', 'a', 'o', 'a', 'i' -> 5 vowels. Remaining 10 alphabetic characters are consonants.",
                        why: "Each character is tested against vowel set; if not in set, it increments consonants counter.",
                        variables: {"vowels found": "['a', 'a', 'o', 'a', 'i'] (5)", "consonants found": "10"},
                        takeaway: "Total characters = 5 vowels + 10 consonants = 15 total.",
                        javaLine: 11,
                        render: () => H.comp('Character Classification', 'Vowels (5)', '+ Consonants (10)', '==', '15 Letters', true)
                    },
                    {
                        title: "Emit Formatted Output",
                        what: "Format output: 'Vowels: 5, Consonants: 10'.",
                        why: "Matches grading test case format exactly.",
                        variables: {"Output": "'Vowels: 5, Consonants: 10'"},
                        takeaway: "Accurate character classification in a single O(L) scan.",
                        javaLine: 18,
                        render: () => H.pipeline('Final Character Tally', [{label:'Total Length', val:'15'}, {label:'Vowels Count', val:'5', success:true}, {label:'Consonants Count', val:'10', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['34'] = anim_34_count_vowels_and_consonants;
    BASIC_ANIMATIONS['count-vowels-and-consonants'] = anim_34_count_vowels_and_consonants;

    const anim_35_palindrome_string_check = {
        id: 35,
        title: "Palindrome String Checker",
        canonicalId: "palindrome-string-check",
        category: "Strings",
        approaches: [
            {
                id: "two-pointers-inward",
                name: "Two-Pointer Inward Mirror Comparison",
                timeComplexity: "O(L)",
                timeExplanation: "At most L/2 character equality comparisons.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two integer pointers (left and right).",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next().toLowerCase();\n        int left = 0, right = s.length() - 1;\n        boolean isPal = true;\n        while (left < right) {\n            if (s.charAt(left) != s.charAt(right)) {\n                isPal = false;\n                break;\n            }\n            left++;\n            right--;\n        }\n        System.out.println(isPal ? \"Palindrome\" : \"Not Palindrome\");\n    }\n}",
                steps: [
                    {
                        title: "Initialize Pointers (s = 'racecar')",
                        what: "Input string: 'racecar'. left = 0 ('r'), right = 6 ('r').",
                        why: "A palindrome must have identical characters at all mirrored positions from the edges.",
                        variables: {"left": 0, "right": 6, "s": "'racecar'"},
                        takeaway: "Pointers move towards each other until they cross or a mismatch is found.",
                        javaLine: 7,
                        render: () => H.array('String Characters: racecar', ['r','a','c','e','c','a','r'], [0, 6], {0: {name:'L=0 (r)', cls:'pin-primary'}, 6: {name:'R=6 (r)', cls:'pin-secondary'}}, 'left=0, right=6: compare r == r')
                    },
                    {
                        title: "Compare Symmetrical Pairs: 'r'=='r', 'a'=='a', 'c'=='c'",
                        what: "Step 1: s[0] == s[6] ('r' == 'r') -> Match. Step 2: s[1] == s[5] ('a' == 'a') -> Match. Step 3: s[2] == s[4] ('c' == 'c') -> Match.",
                        why: "All mirrored pairs match; pointers meet at middle character 'e' (idx 3).",
                        variables: {"Matched Pairs": "3 pairs", "Mismatch": "None"},
                        takeaway: "Early termination occurs on the very first mismatch (short-circuiting).",
                        javaLine: 10,
                        render: () => H.array('All Mirrored Pairs Match', ['r','a','c','e','c','a','r'], [1, 5], {3: {name:'Center e', cls:'pin-success'}}, 'Pair 1 (r==r), Pair 2 (a==a), Pair 3 (c==c)')
                    },
                    {
                        title: "Declare 'Palindrome'",
                        what: "left meets right; loop finishes with isPal = true. Output: 'Palindrome'.",
                        why: "String reads symmetrically forwards and backwards.",
                        variables: {"Verdict": "'Palindrome'"},
                        takeaway: "String is certified palindrome in linear O(L) time and O(1) space.",
                        javaLine: 17,
                        render: () => H.pipeline('Palindrome Certified', [{label:'Word', val:'racecar'}, {label:'Comparisons', val:'3 passed', success:true}, {label:'Verdict', val:'Palindrome', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['35'] = anim_35_palindrome_string_check;
    BASIC_ANIMATIONS['palindrome-string-check'] = anim_35_palindrome_string_check;

    const anim_36_character_frequency_counter = {
        id: 36,
        title: "Character Frequency in String",
        canonicalId: "character-frequency-counter",
        category: "Strings",
        approaches: [
            {
                id: "alphabet-frequency-array",
                name: "26-Element Direct-Mapped Frequency Array",
                timeComplexity: "O(L + \u03a3)",
                timeExplanation: "Linear pass through string to count frequencies, then scan 26 alphabet buckets.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Fixed 26-element integer array for lowercase English letters.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next().toLowerCase();\n        int[] freq = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c >= 'a' && c <= 'z') freq[c - 'a']++;\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < 26; i++) {\n            if (freq[i] > 0) {\n                if (sb.length() > 0) sb.append(\" \");\n                sb.append((char)('a' + i)).append(\":\").append(freq[i]);\n            }\n        }\n        System.out.println(sb.toString());\n    }\n}",
                steps: [
                    {
                        title: "Initialize 26 Frequency Buckets (s = 'success')",
                        what: "Input: 'success'. Initialize 26-element array freq[] with 0. Index (c - 'a') maps letter to bucket.",
                        why: "ASCII arithmetic 'c' - 'a' maps 'a' to 0, 'b' to 1, ..., 'z' to 25 in O(1) time.",
                        variables: {"s": "'success'", "freq array": "26 zeros"},
                        takeaway: "Direct indexing avoids the hash calculation overhead of a Map.",
                        javaLine: 7,
                        render: () => H.registers('Frequency Buckets Setup', [{name:'Input', val:'"success"'}, {name:'Alphabet Buckets', val:'freq[26] initialized'}], 'ASCII mapping: c - 97')
                    },
                    {
                        title: "Tally Characters: s=3, u=1, c=2, e=1",
                        what: "Process characters: 's' -> freq[18]=3, 'u' -> freq[20]=1, 'c' -> freq[2]=2, 'e' -> freq[4]=1.",
                        why: "Each character increments its corresponding bucket.",
                        variables: {"c": 2, "e": 1, "s": 3, "u": 1},
                        takeaway: "Natural array ordering (0..25) automatically keeps letters in alphabetical order.",
                        javaLine: 9,
                        render: () => H.registers('Tallied Buckets', [{name:'c', val:'2', done:true}, {name:'e', val:'1', done:true}, {name:'s', val:'3', done:true}, {name:'u', val:'1', done:true}], 'Frequencies: c:2, e:1, s:3, u:1')
                    },
                    {
                        title: "Format Alphabetical Output: 'c:2 e:1 s:3 u:1'",
                        what: "Iterate buckets 0..25 and append non-zero entries. Output: 'c:2 e:1 s:3 u:1'.",
                        why: "Zero buckets are skipped; non-zero entries output in lexicographical sequence.",
                        variables: {"Output": "'c:2 e:1 s:3 u:1'"},
                        takeaway: "Linear time frequency counting with automatic sorting.",
                        javaLine: 18,
                        render: () => H.pipeline('Formatted Output Emitted', [{label:'char c', val:'c:2'}, {label:'char e', val:'e:1'}, {label:'char s', val:'s:3'}, {label:'char u', val:'u:1', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['36'] = anim_36_character_frequency_counter;
    BASIC_ANIMATIONS['character-frequency-counter'] = anim_36_character_frequency_counter;

    const anim_37_method_overloading_demo = {
        id: 37,
        title: "Method Overloading: Geometry Area",
        canonicalId: "method-overloading-demo",
        category: "Methods and Recursion",
        approaches: [
            {
                id: "compile-time-polymorphism",
                name: "Compile-Time Polymorphism (Method Overloading)",
                timeComplexity: "O(1)",
                timeExplanation: "Method dispatch is resolved at compile time based on parameter signatures.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Two double return values.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static double area(double r) {\n        return Math.PI * r * r;\n    }\n    public static double area(double l, double w) {\n        return l * w;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double r = sc.nextDouble();\n        double l = sc.nextDouble();\n        double w = sc.nextDouble();\n        System.out.printf(\"%.2f\\n\", area(r));\n        System.out.printf(\"%.2f\\n\", area(l, w));\n    }\n}",
                steps: [
                    {
                        title: "Method Signature Declarations",
                        what: "Two methods share same name: area(double) for circle, and area(double, double) for rectangle.",
                        why: "Method overloading allows the same method name to perform related actions on different arguments.",
                        variables: {"Signature 1": "area(double)", "Signature 2": "area(double, double)"},
                        takeaway: "Overloading is determined by method name + parameter list (signature).",
                        javaLine: 4,
                        render: () => H.oop('Method Overloading Signatures', [{header:'Overloaded Methods', fields:[{k:'Method 1', v:'area(double r)'}, {k:'Method 2', v:'area(double l, double w)'}]}])
                    },
                    {
                        title: "Dispatch area(3.5): Circle Area = 38.48",
                        what: "Calling area(3.5) matches single-parameter signature. Compute \u03c0 * 3.5\u00b2 = 38.48.",
                        why: "Compiler binds call directly to area(double) method bytecode.",
                        variables: {"radius": 3.5, "Circle Area": 38.48},
                        takeaway: "Static method dispatch incurs zero runtime virtual lookup penalty.",
                        javaLine: 15,
                        render: () => H.comp('Circle Area Dispatch', 'π', '* (3.5²)', '==', '38.48', true)
                    },
                    {
                        title: "Dispatch area(4.0, 6.0): Rectangle Area = 24.00",
                        what: "Calling area(4.0, 6.0) matches two-parameter signature. Compute 4.0 * 6.0 = 24.00.",
                        why: "Compiler binds call directly to area(double, double) method bytecode.",
                        variables: {"l": 4.0, "w": 6.0, "Rectangle Area": 24.0},
                        takeaway: "Both overloaded methods executed cleanly with matching signatures.",
                        javaLine: 16,
                        render: () => H.pipeline('Dispatched Results', [{label:'area(3.5)', val:'38.48 (Circle)', success:true}, {label:'area(4.0, 6.0)', val:'24.00 (Rect)', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['37'] = anim_37_method_overloading_demo;
    BASIC_ANIMATIONS['method-overloading-demo'] = anim_37_method_overloading_demo;

    const anim_38_recursive_factorial = {
        id: 38,
        title: "Recursive Factorial",
        canonicalId: "recursive-factorial",
        category: "Methods and Recursion",
        approaches: [
            {
                id: "call-stack-recursion",
                name: "Call Stack Frame Unfolding",
                timeComplexity: "O(N)",
                timeExplanation: "N recursive stack frames pushed and popped down to base case.",
                spaceComplexity: "O(N)",
                spaceExplanation: "Auxiliary space on JVM call stack for N active stack frames.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static long fact(int n) {\n        if (n <= 1) return 1;\n        return n * fact(n - 1);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fact(n));\n    }\n}",
                steps: [
                    {
                        title: "Push Stack Frames: fact(5) -> fact(4) -> ... -> fact(1)",
                        what: "fact(5) calls 5 * fact(4). fact(4) calls 4 * fact(3). Stack frames pile up down to fact(1).",
                        why: "Each recursive call suspends the caller and allocates a new activation record on the call stack.",
                        variables: {"Stack Depth": 5, "Deepest Call": "fact(1)"},
                        takeaway: "Every recursive function requires a well-defined base case to prevent StackOverflowError.",
                        javaLine: 5,
                        render: () => H.stack('Call Stack Pushing Down', [{call:'fact(5)', val:'suspended (5 * ?)', active:false}, {call:'fact(4)', val:'suspended (4 * ?)', active:false}, {call:'fact(3)', val:'suspended (3 * ?)', active:false}, {call:'fact(2)', val:'suspended (2 * ?)', active:false}, {call:'fact(1)', val:'Base Case!', active:true}])
                    },
                    {
                        title: "Base Case Hit: fact(1) returns 1",
                        what: "In fact(1): n <= 1 is true. Returns 1 immediately without further recursion.",
                        why: "Base case halts recursion and begins the return phase.",
                        variables: {"Base Case Return": 1},
                        takeaway: "The return value now begins unwinding suspended parent frames.",
                        javaLine: 4,
                        render: () => H.stack('Base Case Reached', [{call:'fact(5)', val:'waiting'}, {call:'fact(4)', val:'waiting'}, {call:'fact(3)', val:'waiting'}, {call:'fact(2)', val:'waiting'}, {call:'fact(1)', val:'returns 1', returned:true}])
                    },
                    {
                        title: "Unwind Stack: 1 -> 2 -> 6 -> 24 -> 120",
                        what: "fact(2) = 2 * 1 = 2. fact(3) = 3 * 2 = 6. fact(4) = 4 * 6 = 24. fact(5) = 5 * 24 = 120.",
                        why: "Each popped frame multiplies its local n by the returned value from the child frame.",
                        variables: {"Final Result": 120, "Output": 120},
                        takeaway: "5! = 120 fully evaluated via stack frame unwinding.",
                        javaLine: 11,
                        render: () => H.stack('Stack Unwinding Complete', [{call:'fact(5)', val:'returns 120', returned:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['38'] = anim_38_recursive_factorial;
    BASIC_ANIMATIONS['recursive-factorial'] = anim_38_recursive_factorial;

    const anim_39_recursive_fibonacci = {
        id: 39,
        title: "Recursive N-th Fibonacci",
        canonicalId: "recursive-fibonacci",
        category: "Methods and Recursion",
        approaches: [
            {
                id: "binary-recursion-tree",
                name: "Binary Tree Recursion",
                timeComplexity: "O(2^N)",
                timeExplanation: "Each non-base call branches into two sub-calls (fib(n-1) and fib(n-2)).",
                spaceComplexity: "O(N)",
                spaceExplanation: "Maximum recursion depth on the call stack is N.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static int fib(int n) {\n        if (n <= 0) return 0;\n        if (n == 1) return 1;\n        return fib(n - 1) + fib(n - 2);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fib(n));\n    }\n}",
                steps: [
                    {
                        title: "Invocation fib(6) & Binary Branching",
                        what: "Target: Compute fib(6). fib(6) branches into fib(5) + fib(4).",
                        why: "Recursive definition directly models mathematical recurrence: F(n) = F(n-1) + F(n-2).",
                        variables: {"Target": "fib(6)", "Sub-problems": "fib(5) and fib(4)"},
                        takeaway: "Binary recursion produces a branching call tree with 2^N leaves in naive implementation.",
                        javaLine: 6,
                        render: () => H.stack('Tree Branching Root', [{call:'fib(6)', val:'fib(5) + fib(4)', active:true}])
                    },
                    {
                        title: "Base Cases: fib(0)=0 and fib(1)=1",
                        what: "Leaves of recursion tree reach base cases fib(0) -> 0 and fib(1) -> 1.",
                        why: "Provides the foundational values that propagate back up the tree.",
                        variables: {"fib(0)": 0, "fib(1)": 1},
                        takeaway: "Tree leaves terminate recursions cleanly.",
                        javaLine: 4,
                        render: () => H.registers('Base Cases', [{name:'fib(0)', val:'0', done:true}, {name:'fib(1)', val:'1', done:true}], 'Base cases return constants 0 and 1')
                    },
                    {
                        title: "Subtree Aggregation: fib(6) = 8",
                        what: "fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5. Finally fib(6) = fib(5) + fib(4) = 5 + 3 = 8.",
                        why: "Returns propagate up: 5 + 3 yields 8.",
                        variables: {"fib(5)": 5, "fib(4)": 3, "fib(6)": 8, "Output": 8},
                        takeaway: "N-th Fibonacci number computed successfully (F(6) = 8).",
                        javaLine: 11,
                        render: () => H.pipeline('Fibonacci Return Aggregation', [{label:'fib(4)', val:'3'}, {label:'fib(5)', val:'5'}, {label:'fib(6) = 5 + 3', val:'8', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['39'] = anim_39_recursive_fibonacci;
    BASIC_ANIMATIONS['recursive-fibonacci'] = anim_39_recursive_fibonacci;

    const anim_40_sum_of_digits_recursion = {
        id: 40,
        title: "Recursive Sum of Digits",
        canonicalId: "sum-of-digits-recursion",
        category: "Methods and Recursion",
        approaches: [
            {
                id: "recursive-decomposition",
                name: "Recursive Digit Decomposition (n % 10 + rec(n / 10))",
                timeComplexity: "O(log10 N)",
                timeExplanation: "Each recursive call chops off one decimal digit.",
                spaceComplexity: "O(log10 N)",
                spaceExplanation: "One stack frame per decimal digit.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static int sumDigits(int n) {\n        if (n == 0) return 0;\n        return (n % 10) + sumDigits(n / 10);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(sumDigits(n));\n    }\n}",
                steps: [
                    {
                        title: "Recursive Call Stack (N = 254)",
                        what: "sumDigits(254) calls 4 + sumDigits(25). sumDigits(25) calls 5 + sumDigits(2). sumDigits(2) calls 2 + sumDigits(0).",
                        why: "Decomposes number into last digit + remaining digits.",
                        variables: {"n": 254, "Stack Depth": 3},
                        takeaway: "Recursively reduces the problem size by a factor of 10 per step.",
                        javaLine: 5,
                        render: () => H.stack('Stack Frames', [{call:'sumDigits(254)', val:'4 + sumDigits(25)'}, {call:'sumDigits(25)', val:'5 + sumDigits(2)'}, {call:'sumDigits(2)', val:'2 + sumDigits(0)', active:true}])
                    },
                    {
                        title: "Base Case: sumDigits(0) returns 0",
                        what: "When n == 0, base case returns 0.",
                        why: "No more digits remain to add.",
                        variables: {"Base Case": "0"},
                        takeaway: "Base case halts recursion.",
                        javaLine: 4,
                        render: () => H.comp('Base Case Reached', 'n == 0', 'returns', '0', '0', true)
                    },
                    {
                        title: "Unwind Sum: 0 + 2 + 5 + 4 = 11",
                        what: "2 + 0 = 2. 5 + 2 = 7. 4 + 7 = 11. Final output: 11.",
                        why: "Stack unwinds, combining digits into final total.",
                        variables: {"Total Digits Sum": 11, "Output": 11},
                        takeaway: "Sum of digits of 254 is 11.",
                        javaLine: 10,
                        render: () => H.pipeline('Digit Summation Unwound', [{label:'Digit 2', val:'2'}, {label:'Digit 5', val:'+ 5 = 7'}, {label:'Digit 4', val:'+ 4 = 11', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['40'] = anim_40_sum_of_digits_recursion;
    BASIC_ANIMATIONS['sum-of-digits-recursion'] = anim_40_sum_of_digits_recursion;

    const anim_41_class_and_object_creation = {
        id: 41,
        title: "Student Record Class",
        canonicalId: "class-and-object-creation",
        category: "Object-Oriented Programming",
        approaches: [
            {
                id: "oop-instance",
                name: "Heap Object Instantiation & Reference Resolution",
                timeComplexity: "O(1)",
                timeExplanation: "Allocates instance in JVM heap and binds reference variable.",
                spaceComplexity: "O(1)",
                spaceExplanation: "One Student instance allocated on the JVM heap.",
                javaCode: "import java.util.Scanner;\n\nclass Student {\n    int rollNo;\n    String name;\n    void display() {\n        System.out.println(\"Roll: \" + rollNo + \", Name: \" + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Student s = new Student();\n        s.rollNo = sc.nextInt();\n        s.name = sc.next();\n        s.display();\n    }\n}",
                steps: [
                    {
                        title: "Class Blueprint Definition",
                        what: "Class Student defines fields: int rollNo, String name, and method display().",
                        why: "A class serves as the mold or blueprint for creating runtime object instances.",
                        variables: {"Class": "Student", "Fields": "rollNo, name", "Methods": "display()"},
                        takeaway: "Classes define state (fields) and behavior (methods).",
                        javaLine: 3,
                        render: () => H.oop('Class Blueprint (Metadata)', [{header:'class Student', fields:[{k:'rollNo', v:'int (4 bytes)'}, {k:'name', v:'String (reference)'}, {k:'display()', v:'void'}]}])
                    },
                    {
                        title: "Heap Allocation with 'new' Keyword",
                        what: "Student s = new Student(): allocates memory on JVM heap, defaults rollNo=0, name=null. Variable 's' holds heap reference address.",
                        why: "The 'new' operator dynamically allocates heap space and calls constructor.",
                        variables: {"Reference s": "@Heap0x4A1", "rollNo": 0, "name": "null"},
                        takeaway: "Reference variable lives on call stack; actual object instance lives on JVM heap.",
                        javaLine: 14,
                        render: () => H.oop('JVM Heap Object Allocation', [{header:'Stack Reference', fields:[{k:'Variable s', v:'points to @0x4A1'}]}, {header:'Heap Object (@0x4A1)', fields:[{k:'rollNo', v:'0 (default)'}, {k:'name', v:'null (default)'}]}])
                    },
                    {
                        title: "Populate Fields & Invoke display()",
                        what: "Assign s.rollNo = 101, s.name = 'Grace'. Invoke s.display(). Output: 'Roll: 101, Name: Grace'.",
                        why: "Dot operator (.) dereferences pointer to mutate and access instance members.",
                        variables: {"s.rollNo": 101, "s.name": "'Grace'", "Output": "'Roll: 101, Name: Grace'"},
                        takeaway: "Object encapsulated its state and behavior successfully.",
                        javaLine: 17,
                        render: () => H.oop('Populated Instance State', [{header:'Student Instance (@0x4A1)', fields:[{k:'rollNo', v:'101'}, {k:'name', v:'"Grace"'}, {k:'display() Output', v:'Roll: 101, Name: Grace'}]}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['41'] = anim_41_class_and_object_creation;
    BASIC_ANIMATIONS['class-and-object-creation'] = anim_41_class_and_object_creation;

    const anim_42_constructor_demonstration = {
        id: 42,
        title: "Constructor Overloading: Book Class",
        canonicalId: "constructor-demonstration",
        category: "Object-Oriented Programming",
        approaches: [
            {
                id: "constructor-overload",
                name: "Constructor Overloading & Field Initialization",
                timeComplexity: "O(1)",
                timeExplanation: "Constructs and initializes object state in constant time.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores Book instance in memory.",
                javaCode: "import java.util.Scanner;\n\nclass Book {\n    String title;\n    double price;\n    Book() {\n        this.title = \"Untitled\";\n        this.price = 0.0;\n    }\n    Book(String title, double price) {\n        this.title = title;\n        this.price = price;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String title = sc.nextLine();\n        double price = sc.nextDouble();\n        Book b = new Book(title, price);\n        System.out.printf(\"Title: %s, Price: $%.2f\\n\", b.title, b.price);\n    }\n}",
                steps: [
                    {
                        title: "Constructor Signatures (Default vs Parameterized)",
                        what: "Class Book provides Book() (default) and Book(String, double) (parameterized).",
                        why: "Constructor overloading allows flexible object initialization depending on available parameters.",
                        variables: {"Default Constructor": "Book()", "Parameterized Constructor": "Book(String, double)"},
                        takeaway: "Constructors share the class name and have no return type.",
                        javaLine: 9,
                        render: () => H.oop('Overloaded Constructors', [{header:'Default Constructor', fields:[{k:'title', v:'"Untitled"'}, {k:'price', v:'$0.00'}]}, {header:'Parameterized Constructor', fields:[{k:'title', v:'this.title = title'}, {k:'price', v:'this.price = price'}]}])
                    },
                    {
                        title: "Invoke Parameterized Constructor",
                        what: "Call new Book('Effective Java', 45.00). Keyword 'this' binds incoming arguments to instance fields.",
                        why: "'this.title' resolves ambiguity between method parameter and class member field.",
                        variables: {"this.title": "'Effective Java'", "this.price": 45.0},
                        takeaway: "'this' refers to the current instance being constructed.",
                        javaLine: 11,
                        render: () => H.registers('Constructor Arguments Bound', [{name:'this.title', val:'"Effective Java"', done:true}, {name:'this.price', val:'$45.00', done:true}], 'Fields initialized via this keyword')
                    },
                    {
                        title: "Verify State & Format Output",
                        what: "Output: 'Title: Effective Java, Price: $45.00'.",
                        why: "Instance fields retain their initialized values.",
                        variables: {"Output": "'Title: Effective Java, Price: $45.00'"},
                        takeaway: "Object created in fully valid state from day 1.",
                        javaLine: 23,
                        render: () => H.pipeline('Constructed Object Output', [{label:'Constructor', val:'Book(title, price)'}, {label:'Instance Stored', val:'Effective Java | $45.00', success:true}, {label:'Console', val:'Title: Effective Java, Price: $45.00', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['42'] = anim_42_constructor_demonstration;
    BASIC_ANIMATIONS['constructor-demonstration'] = anim_42_constructor_demonstration;

    const anim_43_inheritance_example = {
        id: 43,
        title: "Vehicle and Car Inheritance",
        canonicalId: "inheritance-example",
        category: "Object-Oriented Programming",
        approaches: [
            {
                id: "class-inheritance",
                name: "Subclassing (extends) & Constructor Chaining (super)",
                timeComplexity: "O(1)",
                timeExplanation: "Constructs inherited object hierarchy in constant time.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores combined Vehicle and Car state in a unified heap object.",
                javaCode: "import java.util.Scanner;\n\nclass Vehicle {\n    String brand;\n    Vehicle(String brand) {\n        this.brand = brand;\n    }\n}\n\nclass Car extends Vehicle {\n    int doors;\n    Car(String brand, int doors) {\n        super(brand);\n        this.doors = doors;\n    }\n    void drive() {\n        System.out.println(\"Driving \" + brand + \" with \" + doors + \" doors.\");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String brand = sc.next();\n        int doors = sc.nextInt();\n        Car c = new Car(brand, doors);\n        c.drive();\n    }\n}",
                steps: [
                    {
                        title: "Inheritance Hierarchy: Car extends Vehicle",
                        what: "Class Car extends base class Vehicle. Car inherits the 'brand' field and adds its own 'doors' attribute.",
                        why: "Inheritance promotes code reuse and establishes an 'IS-A' relationship (A Car IS-A Vehicle).",
                        variables: {"Superclass": "Vehicle", "Subclass": "Car", "Inherited Fields": "brand"},
                        takeaway: "Subclasses automatically possess all accessible members of their parent class.",
                        javaLine: 10,
                        render: () => H.oop('Inheritance Class Hierarchy', [{header:'Superclass: Vehicle', fields:[{k:'Field', v:'String brand'}]}, {header:'Subclass: Car (extends Vehicle)', fields:[{k:'Inherited', v:'String brand'}, {k:'Added Field', v:'int doors'}, {k:'Method', v:'drive()'}]}])
                    },
                    {
                        title: "Constructor Chaining via super(brand)",
                        what: "Car constructor calls super(brand) as its first statement before initializing doors.",
                        why: "Java requires the superclass part of an object to be initialized before the subclass initializes its own fields.",
                        variables: {"super(brand)": "'Tesla'", "this.doors": 4},
                        takeaway: "super() passes constructor arguments up to the parent class.",
                        javaLine: 13,
                        render: () => H.pipeline('Constructor Chaining', [{label:'Car Constructor', val:'new Car("Tesla", 4)'}, {label:'super("Tesla")', val:'Vehicle Initialized', success:true}, {label:'doors = 4', val:'Car Fields Initialized', success:true}])
                    },
                    {
                        title: "Execute drive() Method",
                        what: "Invoke c.drive(). Accesses both brand ('Tesla') and doors (4). Output: 'Driving Tesla with 4 doors.'.",
                        why: "The child class has seamless access to its parent's protected/public attributes.",
                        variables: {"Output": "'Driving Tesla with 4 doors.'"},
                        takeaway: "Inheritance seamlessly merged state across class levels.",
                        javaLine: 17,
                        render: () => H.pipeline('Method Execution', [{label:'Brand (Parent)', val:'Tesla'}, {label:'Doors (Child)', val:'4'}, {label:'Output', val:'Driving Tesla with 4 doors.', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['43'] = anim_43_inheritance_example;
    BASIC_ANIMATIONS['inheritance-example'] = anim_43_inheritance_example;

    const anim_44_encapsulation_example = {
        id: 44,
        title: "Bank Account Encapsulation",
        canonicalId: "encapsulation-example",
        category: "Object-Oriented Programming",
        approaches: [
            {
                id: "encapsulation-methods",
                name: "Data Hiding with Private Fields & Mutator Methods",
                timeComplexity: "O(1)",
                timeExplanation: "Processes deposit and withdrawal operations in constant time.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores BankAccount state with protected balance field.",
                javaCode: "import java.util.Scanner;\n\nclass BankAccount {\n    private double balance;\n    public BankAccount(double initial) {\n        this.balance = initial;\n    }\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n    public void withdraw(double amount) {\n        if (amount > 0 && amount <= balance) balance -= amount;\n    }\n    public double getBalance() {\n        return balance;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        BankAccount acc = new BankAccount(sc.nextDouble());\n        acc.deposit(sc.nextDouble());\n        acc.withdraw(sc.nextDouble());\n        System.out.printf(\"Balance: %.2f\\n\", acc.getBalance());\n    }\n}",
                steps: [
                    {
                        title: "Private Field Encapsulation (Initial Balance = $1000)",
                        what: "BankAccount declares 'private double balance'. External classes cannot access balance directly.",
                        why: "Encapsulation shields critical internal state from arbitrary external tampering.",
                        variables: {"balance": "$1000.00", "Access": "private"},
                        takeaway: "Private access modifier restricts visibility strictly to within the class.",
                        javaLine: 4,
                        render: () => H.oop('Encapsulated Account Component', [{header:'BankAccount Object', fields:[{k:'[private] balance', v:'$1000.00 (Protected)'}, {k:'[public] deposit()', v:'Validates amount > 0'}, {k:'[public] withdraw()', v:'Validates <= balance'}]}])
                    },
                    {
                        title: "Controlled Mutation: Deposit $500, Withdraw $200",
                        what: "acc.deposit(500.0) -> balance becomes $1500.00. acc.withdraw(200.0) -> balance becomes $1300.00.",
                        why: "Public mutator methods validate business rules before modifying internal private fields.",
                        variables: {"After Deposit": "$1500.00", "After Withdrawal": "$1300.00"},
                        takeaway: "Mutators enforce state consistency and business invariants.",
                        javaLine: 23,
                        render: () => H.pipeline('Controlled State Transitions', [{label:'Initial', val:'$1000.00'}, {label:'deposit(500)', val:'$1500.00', active:true}, {label:'withdraw(200)', val:'$1300.00', success:true}])
                    },
                    {
                        title: "Read via Getter: getBalance() = $1300.00",
                        what: "acc.getBalance() safely returns current balance: 1300.00. Output: 'Balance: 1300.00'.",
                        why: "Getter provides read-only exposure without granting write privileges.",
                        variables: {"getBalance()": 1300.0, "Output": "'Balance: 1300.00'"},
                        takeaway: "Encapsulation protects data integrity while providing clean public APIs.",
                        javaLine: 25,
                        render: () => H.registers('Safe Getter Output', [{name:'Getter Return', val:'$1300.00', done:true}], 'Formatted output: Balance: 1300.00')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['44'] = anim_44_encapsulation_example;
    BASIC_ANIMATIONS['encapsulation-example'] = anim_44_encapsulation_example;

    const anim_45_divide_by_zero_handling = {
        id: 45,
        title: "Safe Integer Division",
        canonicalId: "divide-by-zero-handling",
        category: "Exception Handling",
        approaches: [
            {
                id: "try-catch-arithmetic",
                name: "Defensive Try-Catch Exception Flow",
                timeComplexity: "O(1)",
                timeExplanation: "Catches JVM ArithmeticException on divide-by-zero without application crash.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Zero auxiliary space.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        try {\n            int res = a / b;\n            System.out.println(res);\n        } catch (ArithmeticException e) {\n            System.out.println(\"Error: Division by zero is undefined.\");\n        }\n    }\n}",
                steps: [
                    {
                        title: "Enter Try Block (a = 10, b = 0)",
                        what: "Operands a = 10 and b = 0 enter the try block. Target operation: 10 / 0.",
                        why: "Operations that could cause abnormal termination are guarded inside try blocks.",
                        variables: {"a": 10, "b": 0, "Guarded Op": "a / b"},
                        takeaway: "The try block monitors for hardware or software exceptions.",
                        javaLine: 8,
                        render: () => H.tryCatch('Try Block Guarded Execution', 'int res = 10 / 0; // Hazardous operation', '(Waiting for exceptions...)', 'Evaluating 10 / 0...', false)
                    },
                    {
                        title: "JVM Throws ArithmeticException",
                        what: "CPU detects zero divisor and signals hardware trap. JVM constructs new ArithmeticException('/ by zero') and halts normal execution in try block.",
                        why: "Division by zero is undefined in real mathematics and forbidden in integer arithmetic.",
                        variables: {"Exception Thrown": "java.lang.ArithmeticException: / by zero"},
                        takeaway: "Normal control flow immediately aborts and transfers control to the matching catch block.",
                        javaLine: 9,
                        render: () => H.tryCatch('Exception Trapped', 'int res = 10 / 0; -> HALTED!', 'catch (ArithmeticException e) ACTIVATED', 'ArithmeticException thrown by JVM', true)
                    },
                    {
                        title: "Catch Block Recovery & Safe Message Output",
                        what: "Catch block intercepts exception. Print: 'Error: Division by zero is undefined.'. Application exits with normal status 0.",
                        why: "Graceful handling prevents server process termination.",
                        variables: {"Output": "'Error: Division by zero is undefined.'", "Process Status": "CLEAN EXIT"},
                        takeaway: "Exceptions convert fatal errors into manageable program logic.",
                        javaLine: 12,
                        render: () => H.pipeline('Exception Handled Gracefully', [{label:'Hazardous Op', val:'10 / 0'}, {label:'Intercepted', val:'ArithmeticException', error:true}, {label:'Graceful Output', val:'Error: Division by zero...', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['45'] = anim_45_divide_by_zero_handling;
    BASIC_ANIMATIONS['divide-by-zero-handling'] = anim_45_divide_by_zero_handling;

    const anim_46_custom_exception_age_validator = {
        id: 46,
        title: "Custom InvalidAgeException",
        canonicalId: "custom-exception-age-validator",
        category: "Exception Handling",
        approaches: [
            {
                id: "custom-exception-class",
                name: "User-Defined Checked Exception & Explicit 'throw'",
                timeComplexity: "O(1)",
                timeExplanation: "Constructs and throws custom exception when validation invariant is violated.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores custom exception object in heap.",
                javaCode: "import java.util.Scanner;\n\nclass InvalidAgeException extends Exception {\n    public InvalidAgeException(String msg) {\n        super(msg);\n    }\n}\n\npublic class Main {\n    public static void validateAge(int age) throws InvalidAgeException {\n        if (age < 18) throw new InvalidAgeException(\"Age must be at least 18\");\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        try {\n            validateAge(age);\n            System.out.println(\"Access Granted\");\n        } catch (InvalidAgeException e) {\n            System.out.println(\"Caught: \" + e.getMessage());\n        }\n    }\n}",
                steps: [
                    {
                        title: "Custom Exception Class Definition",
                        what: "InvalidAgeException extends Exception. It encapsulates domain-specific validation errors.",
                        why: "Extending Exception creates a checked exception that must be declared (throws) or caught.",
                        variables: {"Class": "InvalidAgeException", "Superclass": "Exception"},
                        takeaway: "Custom exceptions clarify error semantics for domain-specific business rules.",
                        javaLine: 3,
                        render: () => H.oop('Custom Exception Type', [{header:'class InvalidAgeException extends Exception', fields:[{k:'Constructor', v:'super(message)'}, {k:'Checked Status', v:'Checked (enforced at compile time)'}]}])
                    },
                    {
                        title: "Validation Test: (age < 18)",
                        what: "Input age = 16. Test: 16 < 18 is TRUE! Explicitly execute: throw new InvalidAgeException('Age must be at least 18').",
                        why: "Underage value fails the domain constraint; throwing signals invalid state.",
                        variables: {"age": 16, "Validation": "FAILED (< 18)", "Thrown": "InvalidAgeException"},
                        takeaway: "The 'throw' keyword manually initiates exception propagation.",
                        javaLine: 11,
                        render: () => H.comp('Age Validation Check', 'age (16)', '<', '18', 'TRUE -> Throw Exception!', true)
                    },
                    {
                        title: "Catch Block Handles Custom Exception",
                        what: "Catch block intercepts InvalidAgeException. Print: 'Caught: Age must be at least 18'.",
                        why: "e.getMessage() extracts the detail message passed to super(msg).",
                        variables: {"Output": "'Caught: Age must be at least 18'"},
                        takeaway: "Structured error message matches test case expectations.",
                        javaLine: 20,
                        render: () => H.pipeline('Custom Exception Handled', [{label:'Input Age', val:'16'}, {label:'Thrown Exception', val:'InvalidAgeException', error:true}, {label:'Output Message', val:'Caught: Age must be at least 18', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['46'] = anim_46_custom_exception_age_validator;
    BASIC_ANIMATIONS['custom-exception-age-validator'] = anim_46_custom_exception_age_validator;

    const anim_47_number_format_exception_handling = {
        id: 47,
        title: "Safe String to Integer Parser",
        canonicalId: "number-format-exception-handling",
        category: "Exception Handling",
        approaches: [
            {
                id: "parse-int-guard",
                name: "Integer.parseInt Defensive Guard",
                timeComplexity: "O(L)",
                timeExplanation: "Scans string of length L to parse ASCII digit characters.",
                spaceComplexity: "O(1)",
                spaceExplanation: "Stores input string and result integer.",
                javaCode: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        try {\n            int val = Integer.parseInt(s);\n            System.out.println(\"Parsed: \" + val);\n        } catch (NumberFormatException e) {\n            System.out.println(\"Invalid Integer\");\n        }\n    }\n}",
                steps: [
                    {
                        title: "Input String Ingestion (s = 'xyz')",
                        what: "Input string: 'xyz'. Pass to Integer.parseInt('xyz') inside try block.",
                        why: "External user inputs are untrusted strings that may not represent valid integers.",
                        variables: {"s": "'xyz'", "Target Method": "Integer.parseInt"},
                        takeaway: "Defensive parsing avoids crashing whole servers on malformed inputs.",
                        javaLine: 7,
                        render: () => H.registers('Parsing Target', [{name:'Input String s', val:'"xyz"', active:true}], 'Guarding Integer.parseInt(s)')
                    },
                    {
                        title: "Lexical Parsing Failure \u2014 NumberFormatException",
                        what: "Character 'x' is not an ASCII digit ('0'..'9'). Integer.parseInt throws NumberFormatException: For input string: 'xyz'.",
                        why: "Non-numeric characters violate radix-10 integer representation.",
                        variables: {"Character 'x'": "Not in ['0'..'9']", "Exception": "NumberFormatException"},
                        takeaway: "NumberFormatException is an unchecked RuntimeException thrown during parsing failures.",
                        javaLine: 8,
                        render: () => H.tryCatch('Parsing Attempt', 'int val = Integer.parseInt("xyz"); // Fails on non-digit', 'catch (NumberFormatException e) ACTIVATED', 'Lexical analysis failed on character x', true)
                    },
                    {
                        title: "Catch Block Fallback: 'Invalid Integer'",
                        what: "Catch block intercepts NumberFormatException. Print fallback: 'Invalid Integer'.",
                        why: "Gracefully recovers and outputs user-friendly error indication.",
                        variables: {"Output": "'Invalid Integer'", "Status": "RECOVERED"},
                        takeaway: "Robust parsing pattern for all user-facing inputs.",
                        javaLine: 11,
                        render: () => H.pipeline('Graceful Parsing Fallback', [{label:'Input', val:'"xyz"'}, {label:'Trap', val:'NumberFormatException', error:true}, {label:'Output', val:'Invalid Integer', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['47'] = anim_47_number_format_exception_handling;
    BASIC_ANIMATIONS['number-format-exception-handling'] = anim_47_number_format_exception_handling;

    const anim_48_arraylist_basic_operations = {
        id: 48,
        title: "ArrayList CRUD Operations",
        canonicalId: "arraylist-basic-operations",
        category: "Collections Basics",
        approaches: [
            {
                id: "arraylist-crud",
                name: "Dynamic Array List Resizing & Element Shifting",
                timeComplexity: "O(N)",
                timeExplanation: "Removing element at index 0 requires shifting all remaining elements left by 1.",
                spaceComplexity: "O(N)",
                spaceExplanation: "Stores N elements in an internal dynamically resized array buffer.",
                javaCode: "import java.util.Scanner;\nimport java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        ArrayList<String> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) list.add(sc.next());\n        list.remove(0);\n        System.out.println(String.join(\", \", list));\n    }\n}",
                steps: [
                    {
                        title: "Populate Dynamic List: [Apple, Banana, Cherry, Date]",
                        what: "Create ArrayList<String> and append 4 strings: ['Apple', 'Banana', 'Cherry', 'Date'].",
                        why: "ArrayList automatically expands its internal buffer as elements are appended.",
                        variables: {"Size": 4, "Elements": "[Apple, Banana, Cherry, Date]"},
                        takeaway: "ArrayList wraps a raw Java array with automatic capacity doubling.",
                        javaLine: 9,
                        render: () => H.array('Populated ArrayList (Size 4)', ['Apple', 'Banana', 'Cherry', 'Date'], [0, 1, 2, 3], {0: {name:'Target', cls:'pin-warning'}}, 'Elements at index 0, 1, 2, 3')
                    },
                    {
                        title: "Execute list.remove(0) \u2014 Left Shift",
                        what: "Remove element at index 0 ('Apple'). Banana moves to idx 0, Cherry to idx 1, Date to idx 2. Size becomes 3.",
                        why: "Removing from head requires System.arraycopy to shift all subsequent elements left by 1 index (O(N) operation).",
                        variables: {"Removed": "'Apple'", "New Size": 3, "New Elements": "[Banana, Cherry, Date]"},
                        takeaway: "Removing from the front of an ArrayList takes O(N) linear time due to memory shifting.",
                        javaLine: 10,
                        render: () => H.array('After list.remove(0): Left Shifted', ['Banana', 'Cherry', 'Date'], [0, 1, 2], {}, 'Apple removed; subsequent elements shifted left')
                    },
                    {
                        title: "Format Comma-Separated Output",
                        what: "Join remaining items: 'Banana, Cherry, Date'. Print to console.",
                        why: "String.join separates remaining items with ', '.",
                        variables: {"Output": "'Banana, Cherry, Date'"},
                        takeaway: "CRUD operations successfully performed on dynamic list.",
                        javaLine: 11,
                        render: () => H.pipeline('Output Emitted', [{label:'Original List', val:'4 items'}, {label:'list.remove(0)', val:'Apple discarded'}, {label:'Result Output', val:'Banana, Cherry, Date', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['48'] = anim_48_arraylist_basic_operations;
    BASIC_ANIMATIONS['arraylist-basic-operations'] = anim_48_arraylist_basic_operations;

    const anim_49_hashmap_frequency_counter = {
        id: 49,
        title: "Word Frequency Counter with Map",
        canonicalId: "hashmap-frequency-counter",
        category: "Collections Basics",
        approaches: [
            {
                id: "linked-hashmap-frequency",
                name: "LinkedHashMap Insertion-Ordered Frequency Mapping",
                timeComplexity: "O(N)",
                timeExplanation: "N hash map lookups and insertions with O(1) average hash table operations.",
                spaceComplexity: "O(U)",
                spaceExplanation: "Stores U unique words in doubly-linked hash map buckets.",
                javaCode: "import java.util.Scanner;\nimport java.util.LinkedHashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        Map<String, Integer> map = new LinkedHashMap<>();\n        while (sc.hasNext()) {\n            String word = sc.next();\n            map.put(word, map.getOrDefault(word, 0) + 1);\n        }\n        StringBuilder sb = new StringBuilder();\n        for (Map.Entry<String, Integer> e : map.entrySet()) {\n            if (sb.length() > 0) sb.append(\" \");\n            sb.append(e.getKey()).append(\"=\").append(e.getValue());\n        }\n        System.out.println(sb.toString());\n    }\n}",
                steps: [
                    {
                        title: "Stream Words & Initialize LinkedHashMap",
                        what: "Words stream: 'apple', 'orange', 'apple', 'banana', 'orange', 'apple'. Initialize LinkedHashMap.",
                        why: "LinkedHashMap maintains a doubly-linked list running through all of its entries to preserve insertion order.",
                        variables: {"Map Type": "LinkedHashMap", "Ordering": "Insertion Order"},
                        takeaway: "Standard HashMap does not preserve order; LinkedHashMap guarantees predictable iteration.",
                        javaLine: 8,
                        render: () => H.oop('LinkedHashMap Initialization', [{header:'LinkedHashMap<String, Integer>', fields:[{k:'Initial State', v:'Empty'}, {k:'Order Invariant', v:'Preserves first insertion order'}]}])
                    },
                    {
                        title: "Update Frequencies via getOrDefault()",
                        what: "apple: 3 times. orange: 2 times. banana: 1 time.",
                        why: "map.getOrDefault(word, 0) + 1 increments count if key exists or initializes to 1 if new.",
                        variables: {"apple": 3, "orange": 2, "banana": 1},
                        takeaway: "getOrDefault cleanly replaces verbose if (!map.containsKey) boilerplate.",
                        javaLine: 11,
                        render: () => H.registers('Mapped Word Frequencies', [{name:'"apple" (Key)', val:'3 (Count)', done:true}, {name:'"orange" (Key)', val:'2 (Count)', done:true}, {name:'"banana" (Key)', val:'1 (Count)', done:true}], 'Frequencies mapped in insertion order')
                    },
                    {
                        title: "Emit Formatted String: 'apple=3 orange=2 banana=1'",
                        what: "Iterate entrySet() and emit: 'apple=3 orange=2 banana=1'.",
                        why: "Iterating LinkedHashMap visits entries in exact sequence: apple first, orange second, banana third.",
                        variables: {"Output": "'apple=3 orange=2 banana=1'"},
                        takeaway: "Linear time frequency counting with guaranteed order preservation.",
                        javaLine: 18,
                        render: () => H.pipeline('Word Frequency Map Output', [{label:'First: apple', val:'apple=3'}, {label:'Second: orange', val:'orange=2'}, {label:'Third: banana', val:'banana=1', success:true}])
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['49'] = anim_49_hashmap_frequency_counter;
    BASIC_ANIMATIONS['hashmap-frequency-counter'] = anim_49_hashmap_frequency_counter;

    const anim_50_hashset_duplicate_remover = {
        id: 50,
        title: "Remove Duplicates via HashSet",
        canonicalId: "hashset-duplicate-remover",
        category: "Collections Basics",
        approaches: [
            {
                id: "linked-hashset-dedup",
                name: "LinkedHashSet Unique Ingestion",
                timeComplexity: "O(N)",
                timeExplanation: "N set insertions with O(1) average hash lookup time.",
                spaceComplexity: "O(U)",
                spaceExplanation: "Stores unique elements in the set.",
                javaCode: "import java.util.Scanner;\nimport java.util.LinkedHashSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        LinkedHashSet<Integer> set = new LinkedHashSet<>();\n        for (int i = 0; i < n; i++) {\n            set.add(sc.nextInt());\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int val : set) {\n            if (sb.length() > 0) sb.append(\" \");\n            sb.append(val);\n        }\n        System.out.println(sb.toString());\n    }\n}",
                steps: [
                    {
                        title: "Input Stream with Duplicates: [4, 2, 5, 2, 4, 1]",
                        what: "Read N = 6 integers: 4, 2, 5, 2, 4, 1. Initialize LinkedHashSet<Integer>.",
                        why: "A Set by mathematical definition cannot contain duplicate elements.",
                        variables: {"Input Stream": "[4, 2, 5, 2, 4, 1]", "Set": "Empty"},
                        takeaway: "LinkedHashSet combines Set uniqueness with insertion-ordered iteration.",
                        javaLine: 8,
                        render: () => H.array('Input Stream (6 Elements)', [4, 2, 5, 2, 4, 1], [], {}, 'Notice duplicates: 2 appears twice, 4 appears twice')
                    },
                    {
                        title: "Insert Elements & Reject Duplicates",
                        what: "Add 4 (new) -> Set: {4}. Add 2 (new) -> Set: {4, 2}. Add 5 (new) -> Set: {4, 2, 5}. Add 2 (duplicate!) -> Rejected. Add 4 (duplicate!) -> Rejected. Add 1 (new) -> Set: {4, 2, 5, 1}.",
                        why: "set.add() computes hashCode and checks equals; duplicate elements return false and are ignored.",
                        variables: {"Unique Added": "[4, 2, 5, 1]", "Duplicates Filtered": "[2, 4]"},
                        takeaway: "Duplicate elimination happens in O(1) time per element.",
                        javaLine: 10,
                        render: () => H.registers('Set Ingestion State', [{name:'Element 4', val:'Added (Unique)', done:true}, {name:'Element 2', val:'Added (Unique)', done:true}, {name:'Element 5', val:'Added (Unique)', done:true}, {name:'Element 1', val:'Added (Unique)', done:true}], 'Duplicate 2 and 4 discarded')
                    },
                    {
                        title: "Emit Unique Ordered Sequence: '4 2 5 1'",
                        what: "Iterate through LinkedHashSet. Output: '4 2 5 1'.",
                        why: "Original relative order of first appearance is strictly maintained.",
                        variables: {"Output": "'4 2 5 1'", "Total Unique": 4},
                        takeaway: "Deduplication complete: 6 input elements reduced to 4 unique elements.",
                        javaLine: 16,
                        render: () => H.array('Unique Set Elements', [4, 2, 5, 1], [0, 1, 2, 3], {}, 'Order preserved: 4, 2, 5, 1')
                    },
                ]
            },
        ]
    };
    BASIC_ANIMATIONS['50'] = anim_50_hashset_duplicate_remover;
    BASIC_ANIMATIONS['hashset-duplicate-remover'] = anim_50_hashset_duplicate_remover;

    // -------------------------------------------------------------------------
    // Global API Registration
    // -------------------------------------------------------------------------
    window.CodeArenaBasicAnimations = {
        getAnimation: function (id, slug, prob) {
            if (id !== undefined && id !== null && BASIC_ANIMATIONS[String(id)]) {
                return BASIC_ANIMATIONS[String(id)];
            }
            if (slug && BASIC_ANIMATIONS[String(slug)]) {
                return BASIC_ANIMATIONS[String(slug)];
            }
            return null;
        },
        getRegistry: function () {
            return BASIC_ANIMATIONS;
        }
    };

    console.log('[CodeArena] CodeArenaBasicAnimations module loaded with 50 problems.');
})();
