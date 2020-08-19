<template>
    <div class="TodoViewContainer">
        <div class="TodoViewTreeContainer">
            <TodoTree label="紧急 且 重要"></TodoTree>
            <div class="vertical-divider"></div>
            <TodoTree label="紧急 但 不重要"></TodoTree>
        </div>



        <el-divider></el-divider>
        <div>
            <div class="TodoViewTreeContainer">
                <TodoTree label="不紧急 但 重要"></TodoTree>
                <div class="vertical-divider"></div>
                <TodoTree label="不紧急 且 不重要"></TodoTree>
            </div>
        </div>



    </div>
</template>

<script>
    import TodoTree from '../components/TodoTree.vue'
    export default {
        name: 'TodoView',
        components :{
            TodoTree
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .vertical-divider{
        border-right: solid 1px #DCDFE6;
        width: 1px;
        margin-left: 45px;
        margin-right: 45px;
    }
    .TodoViewContainer{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .TodoViewTreeContainer{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>
