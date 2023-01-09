# 给组件安装依赖指令
pnpm add  @popperjs/core  -r --filter ./packages/guide
# 给文档安装package
pnpm add  naive-ui-guide@* -r --filter ./docs

# 安装
pnpm i
# 根目录运行 schema-form
pnpm run dev:form -w
# 根目录打包  schema-form
pnpm run build:form -w

# 如何不用发包就可调试打包后的lib库
## 1.将库进行软链接，便于本地调试打包后的lib库

    cd ./packages/schema-form && pnpm link 
    
    可将naive-ui-schema-form 进行软链接

## 2.开发项目软链接某lib库
    进入某个开发项目 （目录根据你的项目位置决定）如: 
    pnpm link ../naive-ui-schema-form/packages/schema-form  
    可将naive-ui-schema-form链接到此项目上

    每次改动/packages/schema-form后，build完成后，
     开发项目立即生效，无需发包即可更新



