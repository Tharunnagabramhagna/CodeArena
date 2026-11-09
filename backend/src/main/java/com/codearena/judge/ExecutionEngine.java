
package com.codearena.judge;

import com.codearena.model.ExecutionRequest;
import com.codearena.execution.ExecutionResult;

public interface ExecutionEngine {

    ExecutionResult execute(ExecutionRequest request);

}
