<template>
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <path
        id="path-1"
        d="M1,40 L1360,40 L1360,581 C1360,589.836556 1352.83656,597 1344,597 L17,597 C8.163444,597 1,589.836556 1,581 L1,40 L1,40 Z"
      ></path>
      <filter
        id="filter-2"
        x="-1.6%"
        y="-3.6%"
        width="103.2%"
        height="107.9%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology
          radius="1"
          operator="erode"
          in="SourceAlpha"
          result="shadowSpreadOuter1"
        ></feMorphology>
        <feOffset dx="0" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
        <feGaussianBlur
          stdDeviation="8"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        ></feGaussianBlur>
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0"
          type="matrix"
          in="shadowBlurOuter1"
        ></feColorMatrix>
      </filter>
      <rect id="path-3" x="0" y="-5.68434189e-14" width="1360" height="597" rx="16"></rect>
      <rect id="path-5" x="0" y="0" width="1048" height="817" rx="16"></rect>
    </defs>
    <g id="Pods" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Pods_Create备份" transform="translate(-359.000000, -341.000000)">
        <rect fill="#FFFFFF" x="0" y="0" width="1440" height="900"></rect>
        <g id="表格" transform="translate(40.000000, 212.000000)">
          <g id="矩形">
            <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
            <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use>
          </g>
          <mask id="mask-4" fill="white">
            <use xlink:href="#path-3"></use>
          </mask>
          <use id="矩形" fill="#FFFFFF" xlink:href="#path-3"></use>
          <g id="编组-4" transform="translate(64.000000, 0.000000)"></g>
          <rect id="矩形备份-7" fill="#D7DAE0" x="0" y="132" width="1360" height="1"></rect>
        </g>
        <g id="弹窗">
          <rect id="矩形" fill="#000000" opacity="0.6" x="0" y="0" width="1440" height="900"></rect>
          <g id="编组-52" transform="translate(196.000000, 41.000000)">
            <mask id="mask-6" fill="white">
              <use xlink:href="#path-5"></use>
            </mask>
            <use id="Rectangle-Copy-9" fill="#FFFFFF" xlink:href="#path-5"></use>
            <g id="编组-5" mask="url(#mask-6)" stroke-linecap="round" stroke-linejoin="round">
              <g id="展开备份-3" transform="translate(40.000000, 300.000000)">
                <g
                  transform="translate(135.000000, 12.000000) scale(1, -1) translate(-135.000000, -12.000000) translate(123.000000, 0.000000)"
                >
                  <polyline
                    id="路径-2"
                    stroke="#CCCCCC"
                    stroke-width="2"
                    points="4.66666667 9.25 12 16.5833333 19.3333333 9.25"
                  ></polyline>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>
