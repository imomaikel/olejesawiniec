'use client';
import Script from 'next/script';
import Head from 'next/head';
import React from 'react';

const InPost = () => {
  return (
    <>
      <Head>
        <link rel="stylesheet" type="text/css" href="https://geowidget.inpost.pl/inpost-geowidget.css" />
      </Head>
      <Script src="https://geowidget.inpost.pl/inpost-geowidget.js" defer />
      {/*  */}
      {/* TODO: Point Select */}
      <div className="w-full h-[600px]">{React.createElement('inpost-geowidget')}</div>
    </>
  );
};

export default InPost;
