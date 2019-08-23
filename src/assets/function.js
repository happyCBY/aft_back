/**
 * Created by zqq on 2019/6/3.
 */
import Vue from 'vue';

// 枚举
Vue.filter('enumFormat', function (enumValue, enumType) {
  let result = '未知'
  enumType = parseInt(enumType)
  for (let i = 0; i < window.$constant.VALUE_ENUM_MAPPING.length; i++) {
    if (window.$constant.VALUE_ENUM_MAPPING[i].type === enumType) {
      let temp = window.$constant.VALUE_ENUM_MAPPING[i].data
      for (let j = 0; j < temp.length; j++) {
        if (temp[j].key === enumValue) {
          result = temp[j].value
          break
        }
      }
      break
    }
  }
  return result
})
Vue.filter('noDataFilter', function (value) {
  if (value===''||value===null||value===undefined||window.isNaN(value)) {
    return '--'
  }else{
    return value
  }

});
