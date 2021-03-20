const data_name = 'game_data';

const set = (key, val)=> localStorage.setItem(key, val);
const get = key => localStorage.getItem(key);

const getData = (name = data_name)=> get(name)!=null && JSON.parse(atob(get(name)));
const setData = (data, name = data_name) => set(name, btoa(JSON.stringify(data)));
const clearData = (name = data_name)=> localStorage.removeItem(name);
