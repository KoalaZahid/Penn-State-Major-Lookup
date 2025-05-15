let available_keywords = [];

fetch('Majors_Info (copy).txt')
  .then(response => response.text())
  .then(data => {

    var newData = data.split("\n")
    for (var i = 0; i < newData.length; i++) {
      if (newData[i] != "") {
        available_keywords.push(newData[i])
      }
    }
  });

const result_box = document.querySelector(".result-box");
const input_box = document.getElementById("input-box")

input_box.onkeyup = function() {
  let result = [];
  let input = input_box.value;
  if (input.length) {
    result = available_keywords.filter((keyword) => {
      let majorName = keyword.split("|")[0];
      return majorName.toLowerCase().includes(input.toLowerCase());
    });
  }
  display(result);

  if (!result.length) {
    result_box.innerHTML = '';
  }
}

function display(result) {
  const content = result.map((list) => {
    let major_data = list.split("|");
    let end_campus = major_data[1].split(", ");
    let credit_req = major_data[2];
    let ETM = major_data[3].split(", ");

    let data = "";
    for (let campus of end_campus) {
      let input = campus.replaceAll(" ", "_");
      data += input + ",";
    }
    data += "|" + credit_req + "|";
    for (const c of ETM) {
      let input = c.replaceAll(" or ", "!");
      input = input.replaceAll(" ", "_")
      data += input + ",";
    }

    return "<li onclick=selectInput(this) major_data=" + data + ">" + major_data[0] + "</li>";
  });

  result_box.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectInput(list) {
  let major_data = list.getAttribute('major_data').split("|");
  let end_campus = major_data[0].split(",");
  let credit_req = major_data[1];
  let ETM = major_data[2].split(",");

  const campus_content = end_campus.map((list) => {
    if (list != "") {
      return "<li>" + list.replaceAll("_", " ") + "</li>";
    }
  })
  document.getElementById('campus-list').innerHTML = "<ul>" + campus_content.join('') + "</ul>";

  document.querySelector('.credit-reqs').innerHTML = "<label>Credit requirement: " + credit_req + " credits</label>";

  const etm_content = ETM.map((list) => {
    if (list != "") {
      inp = list.replaceAll("!", " or ");
      inp = inp.replaceAll("_", " ")
      return "<li>" + inp + "</li>";
    }
  })
  document.getElementById('ETM-list').innerHTML = "<ul>" + etm_content.join('') + "</ul>";

  input_box.value = list.innerHTML;
  result_box.innerHTML = '';
}
