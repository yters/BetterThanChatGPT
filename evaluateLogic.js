class Premise {
  negated;
  name;
  constructor(negated, name) {
    this.negated = negated;
    this.name = name;
  }
  logicExpression() {
    if (this.negated) {
      return "!" + this.name;
    } else {
      return this.name;
    }
  }
  variables() {
    return [this.name];
  }
}

class Conditional {
  antecedent;
  consequent;
  constructor(antecedent, consequent) {
    this.antecedent = antecedent;
    this.consequent = consequent;
  }
  logicExpression() {
    return "(!(" + this.antecedent.logicExpression() + ")||(" + this.consequent.logicExpression() + "))"
  }
  variables() {
    return [this.antecedent.name, this.consequent.name];
  }
}

class Conclusion {
  negated;
  name;
  constructor(negated, name) {
    this.negated = negated;
    this.name = name;
  }
  logicExpression() {
    if (this.negated) {
      return "!" + this.name;
    } else {
      return this.name;
    }
  }
  variables() {
    return [this.name];
  }
}

function extractPartsAndEvaluateLogic() {
  let p1vn = document.getElementsByName("premise1VariableNegated")[0].checked;
  let p1v_name = document.getElementsByName("premise1Variable")[0].value;
  let p1_struct = new Premise(p1vn, p1v_name);
  let r1an = document.getElementsByName("rule1AntecedentNegated")[0].checked;
  let r1a_name = document.getElementsByName("rule1Antecedent")[0].value;
  let r1a_struct = new Premise(r1an, r1a_name);
  let r1cn = document.getElementsByName("rule1ConsequentNegated")[0].checked;
  let r1c_name = document.getElementsByName("rule1Consequent")[0].value;
  let r1c_struct = new Premise(r1cn, r1c_name);
  let r1_struct = new Conditional(r1a_struct, r1c_struct);
  let cn = document.getElementsByName("conclusionNegated")[0].checked;
  let c_name = document.getElementsByName("conclusion")[0].value;
  let c_struct = new Conclusion(cn, c_name);
    
  axioms_struct = [
    p1_struct,
    r1_struct
  ];

  evaluateLogic(axioms_struct, c_struct)
}

function evaluateLogic(axioms, conclusion) {
  var variable_instances = axioms.map(l => l.variables()).concat(conclusion.variables());
  console.log("variable instances: " + variable_instances);
  var variables = [...new Set(variable_instances.flat())];
  console.log("variables: " + variables);
  var logic_expression = "!(" + axioms.map(l => l.logicExpression()).join("&&") + ")||(" + conclusion.logicExpression() + ")";
  console.log("logic expression: " + logic_expression);
  evaluateLogicExpression(variables, logic_expression);
}

function evaluateLogicExpression(variables, logic_expression) {
  var contradiction = true;
  var tautology = true;
  iterations = 2**variables.length;
  console.log("iterations: " + iterations);
  for (let i = 0; i < iterations; i++) {
    console.log("i: " + i);
    i_tmp = i;
    for (let j = 0; j < variables.length; j++) {
      var_val = i_tmp % 2;
      this[variables[j]] = var_val;
      console.log(variables[j] + " " + var_val);
      i_tmp = Math.floor(i_tmp/2);
    }
    result = eval(logic_expression);
    console.log("result: " + result);
    if (result) {
      contradiction = false;
    } else {
      tautology = false;
    }
    console.log("===================");
  }
  var message = "contradiction: " + contradiction + "\ntautology: " + tautology + "\n";
  if (tautology) {
    message += "conclusion follows";
  }
  console.log(message);
}

