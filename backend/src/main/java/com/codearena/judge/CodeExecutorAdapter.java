
package com.codearena.judge;

import com.codearena.model.ExecutionRequest;
import com.codearena.execution.CodeExecutor;
import com.codearena.execution.ExecutionResult;

public class CodeExecutorAdapter implements ExecutionEngine {

    private final CodeExecutor codeExecutor;
    private final long timeoutMillis;

    public CodeExecutorAdapter() {
        this.codeExecutor = new CodeExecutor();
        this.timeoutMillis = 5000;
    }

    @Override
    public ExecutionResult execute(ExecutionRequest request) {
        return codeExecutor.execute(request, timeoutMillis);
    }
}
