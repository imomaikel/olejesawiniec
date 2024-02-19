'use client';
import { TInPostPointSelect } from '@/lib/types';
import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    easyPack: any;
    easyPackAsyncInit: () => void;
  }
}

type TInPost = {
  onSelect: (point: TInPostPointSelect) => void;
};
const InPost = ({ onSelect }: TInPost) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    if (window && window.easyPack) {
      if (window.easyPack.leafletMapsApi.initialized === false) {
        window.easyPackAsyncInit();
      }
    }
    return () => {
      window.easyPack.leafletMapsApi.initialized = false;
      window.easyPack.leafletMapsApi.ready = false;
    };
  }, [isMounted]);
  if (!isMounted) return null;

  return (
    <>
      <link rel="stylesheet" href="https://geowidget.easypack24.net/css/easypack.css" type="text/css" />
      <Script
        src="https://geowidget.easypack24.net/js/sdk-for-javascript.js"
        onReady={() => {
          window.easyPackAsyncInit = function () {
            window.easyPack.init({
              defaultLocale: 'pl',
              mapType: 'osm',
              searchType: 'osm',
              points: {
                types: ['parcel_locker'],
              },
              map: {
                initialTypes: ['parcel_locker'],
              },
            });
            window.easyPack.mapWidget('easypack-map', function (point: TInPostPointSelect) {
              onSelect(point);
            });
          };
        }}
      />

      <div id="easypack-map"></div>
    </>
  );
};

export default InPost;
