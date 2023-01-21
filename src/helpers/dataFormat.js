const dataFormat = datas => {
  let result = [];
  datas.forEach(data => {
    let tempData;
    data.forEach(temp => {
      const name = temp.kriteria.name;
      tempData = {
        ...tempData,
        id: temp.teacher_id,
        name: temp.teacher.name,
        [name]: temp.value,
      };
    });
    result.push(tempData);
  });
  return result;
};

module.exports = dataFormat;
