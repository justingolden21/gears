const data_name = 'game_data';

const set = (key, val)=> localStorage.setItem(key, val);
const get = key => localStorage.getItem(key);

const getData = ()=> get(data_name)!=null && JSON.parse(atob(get(data_name)));
const setData = data => set(data_name, btoa(JSON.stringify(data)));
const clearData = ()=> localStorage.removeItem(data_name);