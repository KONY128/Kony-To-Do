<template>
    <div class="custom-tree-container">
        <div class="block">
            <p>{{label}}</p>
            <el-tree
                    draggable
                    :data="data"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    @node-drop="handleDrop"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        {{ node.label }}
                    </span>
                    <span>
                        <el-button
                            class="append_button"
                            type="text"
                            size="mini"
                            @click="() => append(data)"
                        >
                            Append
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)"
                        >
                            Delete
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </div>
        <el-dialog title="输入待办事项内容" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="名称" label-width="120px">
                    <el-input v-model="form.name" autocomplete="off" placeholder="待办事项名称。 示例：学习高数"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAppend()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let id = 1000;

    export default {
        name: "TodoTree",
        props:{
            label : String,
        },
        data() {
            const data = [{
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
                },
                    {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }
            ];
            return {
                tmpNewChild: null,
                tmpData: null,
                dialogFormVisible: false,
                data: JSON.parse(JSON.stringify(data)),
                form: {
                    name: "",
                },
            }
        },
        created() {
            // 页面加载时加载数据
            this.load();
        },
        methods: {
            // 按下append按钮，弹出弹窗
            append(data) {
                // 显示弹窗
                this.dialogFormVisible = true;
                // 将数据放入tmpData，方便confirmAppend函数调用
                this.tmpData = data;
            },

            // 点击确认按钮以后
            confirmAppend(){
                // 关闭弹窗
                this.dialogFormVisible = false;
                let data = this.tmpData;
                // 准备数据
                const newChild = { id: id++, label: this.form.name, children: [] };
                // 对于没有child属性的情况，要创建children避免报错
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                // 插入数据
                data.children.push(newChild);
                // 持久化
                this.save();
            },

            remove(node, data) {

                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);

                // 持久化
                this.save();
            },

            // 节点拖拽成功时的触发事件
            handleDrop(draggingNode, dropNode, dropType, ev) {
                console.log('tree drop: ', dropNode.label, dropType, JSON.stringify(ev));
                this.save();
            },

            // 持久化
            save(){
                localStorage.setItem(this.label, JSON.stringify(this.data));
                localStorage.setItem(this.label + id.toString(), id.toString());
            },

            // 从持久化层中读取
            load(){
                this.data = []
                this.data = JSON.parse(localStorage.getItem(this.label));
                id = parseInt(localStorage.getItem(this.label + id.toString()));
            },


        }
    };
</script>

<style scoped>
    .append_button {
        margin-left: 30px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
