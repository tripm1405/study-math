export default class ViewUtil {
  static getOptions = (options) => ({
    layout: 'layouts/main.layout.ejs',
    data: {},
    ...options,
  })
}