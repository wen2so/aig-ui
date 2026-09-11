
import { Navigation } from './navigation.js';
export default { title: '通用/Navigation', component: Navigation };
export const preview = {"name":"Navigation","label":"导航","description":"原生导航与可组合链接，标记当前页面并支持长文本换行。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Navigation aria-label="工作空间导航"><Navigation.Item href="#Navigation" current>项目</Navigation.Item><Navigation.Item href="#top">组件总览</Navigation.Item></Navigation>; }
