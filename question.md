1.库依赖了vite-plugin-svg-icons插件，useI18n, primaryColor， useDesign (已经解决) npm包 周三之前出

2.itemProps, componentProps, colProps等属性作用，梳理一下schema定义，定义挺乱的 @gang.yang


5.样式问题
  1.grid布局，目前的样式其实都是百分比，自定义固定宽度做不到 @mengyu.lu
  2.add, remove按钮的图片样式需要预留配置接口 
  3.ui单独拆出schema
  4.style 样式 + 图片示意 梳理  @yandong.wang

6.把colProps, rowProps改成 grid props, gridItem props,
  itemProps改成FormItemProps， itemStyle改formItemStyle

7.showAdvanceButton 删掉
8.transFormDataFunc 未实现

9.formSubmitRequestFu: 可以考虑改名字

10.effect干掉
11.labelExtra干掉
12.valueProps 干掉
13 useDefaultRUle干掉.
14.isAdvanced干掉
15.render 改成 renderComponentContent
16.renderColComponent 改成 renderFormItem
17.renderComponent不变
18.slot改成formItemSlot
19.colSlot改成slot
20.items 改成children
21.isValidateTrigger 


25.展开收起 没有v-show 效果

26.expend主动触发

3.arrayItem 初始化、删除、添加操作，会改变schema结构，不太合理
4.arrayItem的items配置是一个二维数组，使用上也不符合常理，有点不太合理 
5. formModal定义

23.生命周期

24.钩子函数

28.支持template形式编写
