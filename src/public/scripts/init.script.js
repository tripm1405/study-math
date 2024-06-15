function obj2FormData(formData, valueCurrent, keyCurrent) {
  const ObjType = typeof({});

  if (typeof(valueCurrent) === ObjType) {
    for (const key in valueCurrent) {
      obj2FormData(formData, valueCurrent[key], keyCurrent ? `${keyCurrent}[${key}]` : key);
    }
    return;
  }

  formData.set(keyCurrent, valueCurrent);
}

class K {
  static async exportJson(props) {
    const {
      res,
    } = props;

    const type = res.headers['content-type'];
    const blob = new Blob(
      [
        JSON.stringify(res?.data?.result, null, '\t'),
      ],
      {
        type: type,
        encoding: 'UTF-8',
      }
    );
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'block.json';
    link.click();
  }
}