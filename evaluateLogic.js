function extractPartsAndEvaluateLogic() {
  let p1vn = document.getElementsByName("premise1VariableNegated")[0].checked;
  let p1v_name = document.getElementsByName("premise1Variable")[0].value;
  let r1an = document.getElementsByName("rule1AntecedentNegated")[0].checked;
  let r1a_name = document.getElementsByName("rule1Antecedent")[0].value;
  let r1cn = document.getElementsByName("rule1ConsequentNegated")[0].checked;
  let r1c_name = document.getElementsByName("rule1Consequent")[0].value;
  let cn = document.getElementsByName("conclusionNegated")[0].checked;
  let c_name = document.getElementsByName("conclusion")[0].value;

  logicParts = new Map();
  logicParts.set("p1vn", p1vn);
  logicParts.set("p1v_name", p1v_name);
  logicParts.set("r1an", r1an);
  logicParts.set("r1a_name", r1a_name);
  logicParts.set("r1cn", r1cn);
  logicParts.set("r1c_name", r1c_name);
  logicParts.set("cn", cn);
  logicParts.set("c_name", c_name);

  evaluateLogic(logicParts);
}
function evaluateLogic(logicParts) {
  let p1vn = logicParts.get("p1vn");
  let p1v_name = logicParts.get("p1v_name");
  let r1an = logicParts.get("r1an");
  let r1a_name = logicParts.get("r1a_name");
  let r1cn = logicParts.get("r1cn");
  let r1c_name = logicParts.get("r1c_name");
  let cn = logicParts.get("cn");
  let c_name = logicParts.get("c_name");

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

