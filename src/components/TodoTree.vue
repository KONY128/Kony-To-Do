<template>
    <div class="custom-tree-container">
        <div class="block">
            <p>{{label}}</p>
            <el-button
                    class="append_button"
                    type="text"
                    size="mini"
                    @click="() => newToDo()"
                    style="margin-left: 0;"
            >
                New To Do
            </el-button>
            <el-tree
                    draggable
                    :data="data"
                    node-key="id"
                    :highlight-current="false"
                    :expand-on-click-node="false"
                    :indent="24"
                    empty-text="👆 no data"
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
                            Append sub-plan
                        </el-button>
                        <span class="button_divider"></span>
                        <el-popconfirm
                                :confirmButtonText='popConfirm.confirmText'
                                :cancelButtonText='popConfirm.cancelText'
                                icon="el-icon-info"
                                iconColor="red"
                                :title="popConfirm.title"
                                @onConfirm="remove(node,data)"
                        >
                            <el-button
                                    slot="reference"
                                    type="text"
                                    size="mini"
                                    @click="() => updatePopConfirm(data)"
                            >
                                Finish
                            </el-button>
                        </el-popconfirm>
                    </span>
                </span>
            </el-tree>
        </div>
        <el-dialog title="Enter the to-do content" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="name" label-width="120px" prop="name">
                    <el-input
                            v-model="form.name"
                            autocomplete="off"
                            placeholder="to-do name. Example: study algorithm"
                            show-word-limit
                            maxlength="35"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="confirmAppend()">Confirm</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let id = 1000;
    const data = [{
        id: 1,
        label: 'level one 1',
        children: [{
            id: 4,
            label: 'level two 1-1',
            children: [{
                id: 9,
                label: 'level three 1-1-1'
            }, {
                id: 10,
                label: 'level three 1-1-2'
            }]
        }]
    },
        {
            id: 2,
            label: 'level one 2',
            children: [{
                id: 5,
                label: 'level two 2-1'
            }, {
                id: 6,
                label: 'level two 2-2'
            }]
        }, {
            id: 3,
            label: 'level one 3',
            children: [{
                id: 7,
                label: 'level two 3-1'
            }, {
                id: 8,
                label: 'level two 3-2'
            }]
        }
    ];
    const rules = {
        name: [
            { required: true, message: 'please enter the name of the to-do', trigger: 'blur' },
        ]};
    const form = {
        name: ""
    };
    const popConfirm = {
            title: "Confirm finishing this to-do?",
            cancelText: "Nope!",
            confirmText: "YES!",
    }
    export default {
        name: "TodoTree",
        props:{
            label : String,
        },
        data() {
            return {
                tmpNewChild: null,
                tmpData: null,
                dialogFormVisible: false,
                data: JSON.parse(JSON.stringify(data)),
                rules: JSON.parse(JSON.stringify(rules)),
                form: JSON.parse(JSON.stringify(form)),
                popConfirm: JSON.parse(JSON.stringify(popConfirm)),
            }
        },
        created() {
            // 页面加载时加载数据
            this.load();
        },
        methods: {
            // 按下append按钮，弹出弹窗
            append(data) {
                // 清除表单内容
                this.clearForm();
                // 显示弹窗
                this.dialogFormVisible = true;
                // 将数据放入tmpData，方便confirmAppend函数调用
                this.tmpData = data;
            },

            // 点击append弹窗确认按钮以后
            confirmAppend(){
                // 验证表单内容
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        // 关闭弹窗
                        this.dialogFormVisible = false;
                        let data = this.tmpData;
                        /*
                            判断data是否为空
                            为空：添加level one表单
                            不为空：添加level one表单以外的表单
                         */
                        if (data != null){
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
                        }
                        else{
                            // 准备数据
                            const newToDo = { id: id++, label: this.form.name };
                            // 如果data是空的，要注意先初始化data
                            if (this.data == null){
                                this.data = [];
                            }
                            this.data.push(newToDo);
                        }
                        // 持久化
                        this.save();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 点击删除按钮
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
                localStorage.setItem(this.label + "id", id.toString());
            },

            // 从持久化层中读取
            load(){
                this.data = []
                this.data = JSON.parse(localStorage.getItem(this.label));
                if (this.data == null){
                    this.data = []
                }
                id = parseInt(localStorage.getItem(this.label + "id"));
                if (id == null || id <= 0 || typeof(id) == "undefined" || isNaN(id)){
                    id = 2000;
                }
                console.log(JSON.stringify(this.data));
                console.log(id);
            },

            // 点击newToDo按钮
            newToDo(){
                // 清除表单内容
                this.clearForm();
                // 显示弹窗
                this.dialogFormVisible = true;
                // 将null放入tmpData，方便confirmAppend函数鉴别这是level one表单
                this.tmpData = null;
            },

            // 清除表单内容
            clearForm(){
                this.form = {};
                this.form = JSON.parse(JSON.stringify(form));
                // 清除表单验证
                // 必须要加if，因为代码量过大，对应的对象来不及生成，会导致了读取空对象报错
                // if内的代码只在Dialog显示一遍过后才会生效
                if (this.$refs['form']!==undefined) {
                    this.$refs['form'].resetFields();
                }
            },

            // 点击Finish后更新popConfirm内容
            updatePopConfirm(data){
                this.popConfirm = {};
                this.popConfirm = JSON.parse(JSON.stringify(popConfirm));
                this.popConfirm.title = "Confirm finishing  " + data.label + " ?"
            },
        }
    };
</script>

<style scoped>
    .button_divider{
        width: 1px;
        border-right: solid 1px #DCDFE6;
        margin-left: 5px;
        margin-right: 5px;
    }
    .custom-tree-container{
        min-width: 500px;
    }
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
