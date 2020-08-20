<template>
    <div class="footer">
        <div style="align-self: center; color: #409EFF; font-size: 12px; margin-top: 25px;">
            contact creator by lhy159840@gmail.com
        </div>
        <div style="align-self: center; color: #409EFF; font-size: 12px; margin-top: 2px;">
            developed by@<a :href="'https://github.com/KONY128'" target="_blank" rel="noopener noreferrer">KONY128</a>
        </div>
    </div>
</template>

<style scoped>
    .footer{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 70px;
    }
</style>

<script>
    export default {
        name: 'Footer',
    }
</script>
