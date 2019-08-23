
export default {
  GLOBAL_PAGE_INDEX:1,
  GLOBAL_PAGE_SIZE:10,
  IMG_FILE_SIZE:1 * 1024 * 1024,//图片大小
  IMG_ACCEPT_TYPE:[ "image/jpeg"],//图片格式
  SELECTED_ALL:0,
  SELECTED_TRUE:1,
  SELECTED_FALSE:-1,
  STATUS_OPTIONS:[
    {
      value:0,
      label:'全部状态'
    },
    {
      value:1,
      label:'启用'
    },
    {
      value:-1,
      label:'禁用'
    }
  ],
  SETTING_STATUS_OPTIONS:[
    {
      value: '',
      label: '全部状态'
    }, {
      value: 1,
      label: '已开启'
    }, {
      value: -1,
      label: '已关闭'
    }, {
      value: 0,
      label: '未开启'
    }
  ],
  VALUE_ENUM_MAPPING: [
    {
      type: 1,
      data: [
        {
          key: 1,
          value:'已开启'
        },
        {
          key:-1,
          value:'已关闭'
        },
        {
          key:0,
          value:'未开启'
        }
      ]
    }
  ],
  SETTING_STATUS:1,//期数状态
  BASE_URL: 'http://47.56.16.162:8011/'//开发库接口地址
}
