import API from 'API.js';

export function video($app){
    this.$target = $app;

    API.GetData();
}