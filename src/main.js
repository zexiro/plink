import { mount } from 'svelte';
import App from './App.svelte';
import './styles/global.css';
import { inject } from '@vercel/analytics';

inject();

const app = mount(App, { target: document.getElementById('app') });

export default app;
