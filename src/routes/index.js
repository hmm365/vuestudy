import { comment } from 'postcss';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '~/pages/Home';

export default createRouter({
    //hash모드 : 특정 페이지에서 새로고침 했을 때, '페이지를 찾을 수 없음'과 같은 메세지 알림음 방지
    history: createWebHashHistory(),

    //pages: page 구분

    routes: [
        {
            //페이지경로
            path: '/',
            name: Home,
            component: Home,
        },
    ],
});
