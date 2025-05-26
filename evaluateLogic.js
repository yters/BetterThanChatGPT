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
    
  argument_struct = [
    p1_struct,
    r1_struct,
    c_struct
  ];

  variables = [...new Set(argument_struct.map(l => l.variables()).flat())];
  console.log("variables: " + variables);
  logic_expression = argument_struct.map(l => l.logicExpression()).join("&&");
  console.log("logic expression: " + logic_expression);
  evaluateLogic(argument_struct);
}

function evaluateLogic(argument_struct) {
  let p1_struct = argument_struct[0];
  let p1vn = p1_struct.negated;
  let p1v_name = p1_struct.name;
  
  let r1_struct = argument_struct[1];

  let r1a_struct = r1_struct.antecedent;
  let r1an = r1a_struct.negated;
  let r1a_name = r1a_struct.name;

  let r1c_struct = r1_struct.consequent;
  let r1cn = r1c_struct.negated;
  let r1c_name = r1c_struct.name;

  let c_struct = argument_struct[2];
  let cn = c_struct.negated;
  let c_name = c_struct.name;

  let variables = new Map();
  contradiction = true;
  tautology = true;
  for(let p1v_val = 0; p1v_val <= 1; p1v_val++) {
    for(let r1a_val = 0; r1a_val <= 1; r1a_val++) {
      for(let r1c_val = 0; r1c_val <= 1; r1c_val++) {
        for(let c_val = 0; c_val <= 1; c_val++) {
          console.log("p1v_val: " + p1v_val + " r1a_val: " + r1a_val + " r1c_val: " + r1c_val + " c: " + c_val);
          variables.set(p1v_name, p1v_val);
          variables.set(r1a_name, r1a_val);
          variables.set(r1c_name, r1c_val);
          variables.set(c_name, c_val);
          
          let p1v = variables.get(p1v_name);
          console.log("p1vn: " + p1vn + " p1v: " + p1v);
          let p1 = !p1vn && p1v;
          console.log("p1: " + p1);
          
          let r1a = variables.get(r1a_name);
          console.log("r1an: " + r1an + " r1a: " + r1a);
          let r1c = variables.get(r1c_name);
          console.log("r1cn: " + r1cn + " r1c: " + r1c);
          let r1 = !(!r1an && r1a) || (!r1cn && r1c);
          console.log("r1: " + r1);
          
          let axioms = p1 && r1;
          console.log("axioms: " + axioms);
  
          let c = variables.get(c_name);
          let result = !axioms || (!cn && c);
          console.log("result: " + result);
          console.log("========================");
          if (result) {
            contradiction = false;
          } else {
            tautology = false;
          }
        }
      }
    }
  }
  message = "contradiction: " + contradiction + "\ntautology: " + tautology + "\n";
  if (tautology) {
    message += "conclusion follows from premises";
  } else {
    message += "conclusion does not follow from premises";
  }
  alert(message);
}

