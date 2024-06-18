
class K {
  static obj2FormData(formData, valueCurrent, keyCurrent = null) {
    const ObjType = typeof({});

    if (typeof(valueCurrent) === ObjType) {
      for (const key in valueCurrent) {
        K.obj2FormData(formData, valueCurrent[key], keyCurrent ? `${keyCurrent}[${key}]` : key);
      }
      return;
    }

    formData.set(keyCurrent, valueCurrent);
  }

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