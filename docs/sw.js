const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v3';
const assets = [
	'/',
	'/index.html',
	'/404.html',
	'/pages/fallback.html',
	'/js/scripts.js',
	'/js/game.js',
	'/js/crafting.js',
	'/js/storage.js',
	'/js/util.js',
	'/js/image.js',
	'/js/settings.js',
	'/js/lib/umbrella.min.js',
	'/js/components/progressbar.js',
	'/js/components/snackbar.js',
	'/js/components/tabs.js',
	'/css/styles.css',
	'/img/icons/icon96.png',
	'/img/sprites/bolt.png',
	'/img/sprites/converters.png',
	'/img/sprites/crafters.png',
	'/img/sprites/factories.png',
	'/img/sprites/gears.png',
	'/img/sprites/nuts.png',
	'/img/sprites/screws.png',
	'/img/sprites/time.png',
	'/img/sprites/warehouses.png',
];

// cache size limit function
const limitCacheSize = (name, size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if(keys.length > size){
				cache.delete(keys[0]).then(limitCacheSize(name, size));
			}
		});
	});
};

// install event
self.addEventListener('install', evt => {
	//console.log('service worker installed');
	evt.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			console.log('caching shell assets');
			cache.addAll(assets);
		})
	);
});

// activate event
self.addEventListener('activate', evt => {
	//console.log('service worker activated');
	evt.waitUntil(
		caches.keys().then(keys => {
			//console.log(keys);
			return Promise.all(keys
				.filter(key => key !== staticCacheName && key !== dynamicCacheName)
				.map(key => caches.delete(key))
			);
		})
	);
});

// fetch event
self.addEventListener('fetch', evt => {
	//console.log('fetch event', evt);
	evt.respondWith(
		caches.match(evt.request).then(cacheRes => {
			return cacheRes || fetch(evt.request).then(fetchRes => {
				return caches.open(dynamicCacheName).then(cache => {
					cache.put(evt.request.url, fetchRes.clone());
					// check cached items size
					limitCacheSize(dynamicCacheName, 100);
					return fetchRes;
				})
			});
		}).catch(() => {
			if(evt.request.url.indexOf('.html') > -1){
				return caches.match('/pages/fallback.html');
			} 
		})
	);
});