/* The picture a share turns into: a 1080 square of SVG, built as a string
   and handed to components/ShareModal, which paints it through an <img>
   onto a canvas and hands the PNG to the share sheet, the clipboard or a
   download.

   That trip is why everything here is self-contained. An <img> loading an
   SVG fetches nothing: no stylesheet, no font file, no <image href>, no
   remote gradient. So the type is named by stack with real fallbacks and
   the stickers are inlined whole, straight out of public/stickers.

   Every string that came from anywhere else (a name from MyMLH, a label,
   a date) goes through escapeXml on the way in. One unescaped ampersand
   in a name and the whole document fails to parse, and the card comes out
   blank.

   Relative imports and no JSX: Node's test runner reads this. */
import { my } from '../data/content.mjs';

export const CARD_SIZE = 1080;

const PAPER = '#e4e5da';
const FOREST = '#3d5f58';
const INK = '#10201d';
const WHITE = '#f7f7f2';
const MUTED = '#52635f';

const DISPLAY =
  "'Barlow Semi Condensed', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const BODY = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'Martian Mono', ui-monospace, Menlo, monospace";

/* The base every card is drawn on, Jacklyn's artwork (Figma, 2026-09-21):
   forest above, paper below, and between them the stair the homepage
   hero wears, stepping down from the top right corner to the left edge
   at 503, its treads in the palette. The wordmark sits on the forest,
   top left, as vector outlines, so the card names itself without a font.
   The paper is clear from y 271 at x 230 and from 223 across the middle,
   which is where everything else is laid. */
const STAIR = `<path d="M562.577 175.221H288.203V223.192H562.577V175.221Z" fill="#f5b726"/><path d="M731.947 222.449H562.576V270.42H731.947V222.449Z" fill="#671912"/><path d="M288.22 223.176H230.672V271.147H288.22V223.176Z" fill="#f5b726"/><path d="M29.2598 454.951H0.494141V502.922H29.2598V454.951Z" fill="#e97b77"/><path d="M58.0254 319.119H29.2598V454.982H58.0254V319.119Z" fill="#e53927"/><path d="M230.654 271.146H58.0254V319.117H230.654V271.146Z" fill="#e97b77"/><path d="M1021.96 26.7188H905.377V74.6897H1021.96V26.7188Z" fill="#e97b77"/><path d="M905.376 74.6895H847.828V122.66H905.376V74.6895Z" fill="#f5b726"/><path d="M1079.51 0H1021.96V26.7182H1079.51V0Z" fill="#f5b726"/><path d="M847.828 122.66H790.279V170.631H847.828V122.66Z" fill="#8bb2de"/><path d="M790.297 170.631H731.947V223.176H790.297V170.631Z" fill="#8bb2de"/><path d="M1079.51 3.26729V26.7181H1022.33L1021.96 26.8815V74.6891H905.377V122.66H847.828V170.631H790.28V223.176H731.947V270.419H562.576V223.176H288.271H288.202V271.147H230.671V319.118H58.0258V454.996H29.2602V502.923H0.49449V454.952H0V1080H1080V3.07422L1079.51 3.26729Z" fill="#e4e5da"/>`;
const wordmark = () =>
  `<g fill="${PAPER}"><title>${escapeXml(my.share.card.wordmark)}</title><path d="M445.935 115.208C445.288 115.208 444.984 114.845 444.984 114.097V55.8383C444.984 55.09 445.308 54.7266 445.935 54.7266H474.766C475.413 54.7266 475.717 55.09 475.717 55.8383V64.3259C475.717 65.0741 475.393 65.4376 474.766 65.4376H456.415V80.4031H472.237C472.823 80.4031 473.107 80.8093 473.107 81.6003V89.7244C473.107 90.4727 472.823 90.8361 472.237 90.8361H456.415V114.097C456.415 114.845 456.092 115.208 455.464 115.208H445.935Z"/><path d="M481.769 115.208C481.122 115.208 480.818 114.845 480.818 114.097V55.8383C480.818 55.09 481.142 54.7266 481.769 54.7266H510.6C511.247 54.7266 511.551 55.09 511.551 55.8383V64.3259C511.551 65.0741 511.227 65.4376 510.6 65.4376H492.249V79.5693H508.941C509.588 79.5693 509.892 79.9327 509.892 80.681V88.6127C509.892 89.361 509.568 89.7244 508.941 89.7244H492.249V104.497H510.6C511.247 104.497 511.551 104.861 511.551 105.609V114.097C511.551 114.845 511.227 115.208 510.6 115.208H481.769Z"/><path d="M534.874 116C528.461 116 523.888 114.397 521.157 111.19C518.425 107.983 517.293 103.493 517.758 97.7208C517.819 96.8656 518.162 96.438 518.81 96.438H528.076C528.724 96.438 529.007 96.8656 528.946 97.7208C528.825 100.244 529.29 102.189 530.342 103.579C531.394 104.968 533.013 105.653 535.238 105.653C537.464 105.653 538.981 105.161 539.993 104.177C541.004 103.194 541.53 101.676 541.53 99.6449C541.53 98.5332 541.389 97.5284 541.085 96.6518C540.802 95.7539 540.316 94.9629 539.649 94.2574C538.981 93.5518 538.071 92.8677 536.897 92.1836L527.55 86.176C524.111 84.0167 521.663 81.665 520.206 79.1208C518.749 76.5767 518.041 73.3912 518.102 69.5643C518.162 64.5829 519.579 60.7561 522.33 58.0623C525.102 55.3899 529.209 54.043 534.692 54.043C540.741 54.043 545.253 55.5609 548.227 58.6181C551.201 61.654 552.456 66.0154 551.99 71.6809C551.869 72.7284 551.525 73.2415 550.938 73.2415H541.591C540.883 73.2415 540.6 72.7284 540.721 71.6809C540.903 69.5857 540.499 67.854 539.548 66.4643C538.576 65.0747 537.079 64.3905 535.056 64.3905C533.255 64.3905 531.88 64.8181 530.949 65.6733C530.018 66.5285 529.513 67.854 529.472 69.6498C529.472 71.3816 529.857 72.7926 530.646 73.9043C531.435 75.016 532.649 76.0636 534.267 77.0471L543.533 82.8622C545.86 84.3374 547.721 85.8553 549.077 87.4374C550.453 88.9981 551.444 90.7512 552.051 92.6967C552.658 94.6422 552.941 96.9512 552.88 99.6663C552.88 104.968 551.444 109.009 548.591 111.81C545.739 114.61 541.166 116 534.874 116Z"/><path d="M569.917 115.208C569.269 115.208 568.946 114.845 568.946 114.097V65.4376H557.595C556.948 65.4376 556.645 65.0741 556.645 64.3259V55.8383C556.645 55.09 556.968 54.7266 557.595 54.7266H591.666C592.313 54.7266 592.617 55.09 592.617 55.8383V64.3259C592.617 65.0741 592.293 65.4376 591.666 65.4376H580.316V114.097C580.316 114.845 580.033 115.208 579.446 115.208H569.917Z"/><path d="M126.458 55.5818C126.276 55.026 125.912 54.748 125.325 54.748H113.004C112.417 54.748 112.073 55.026 111.952 55.5818L97.5263 114.011C97.243 114.802 97.4656 115.209 98.2344 115.209H108.452C109.099 115.209 109.443 114.909 109.504 114.289L111.81 103.022H126.377L128.643 114.375C128.825 114.931 129.169 115.209 129.695 115.209H140.175C140.883 115.209 141.146 114.802 140.964 114.011L126.458 55.5818ZM113.793 93.2521L116.828 78.3935C117.171 76.2983 117.536 74.2032 117.92 72.108C118.304 70.0128 118.669 67.9604 119.013 65.9294H119.195C119.539 67.9604 119.903 70.0342 120.247 72.108C120.591 74.2032 120.995 76.2983 121.461 78.3935L124.415 93.2521H113.793Z"/><path d="M181.305 93.2525H171.877C171.23 93.2525 170.946 93.616 171.007 94.3643C171.189 97.6353 170.663 100.265 169.47 102.253C168.276 104.263 166.172 105.246 163.137 105.246C160.406 105.246 158.322 104.348 156.926 102.531C155.53 100.714 154.822 97.7422 154.822 93.616V76.1705C154.822 72.1726 155.51 69.265 156.865 67.4478C158.241 65.6305 160.325 64.7326 163.117 64.7326C165.909 64.7326 168.033 65.6733 169.328 67.5547C170.603 69.436 171.129 72.0871 170.906 75.5505C170.845 76.3415 171.129 76.7477 171.776 76.7477H181.305C181.892 76.7477 182.216 76.3415 182.256 75.5505C182.782 71.1891 182.337 67.405 180.901 64.1981C179.464 60.9912 177.239 58.5112 174.224 56.7154C171.189 54.9409 167.467 54.043 163.036 54.043C156.683 54.043 151.827 55.8816 148.449 59.5374C145.07 63.1933 143.391 68.6664 143.391 75.914V94.1932C143.391 101.569 145.07 107.064 148.449 110.634C151.827 114.204 156.683 115.979 163.036 115.979C169.733 115.979 174.77 114.033 178.149 110.164C181.528 106.294 182.924 101.035 182.337 94.3856C182.216 93.6374 181.872 93.2739 181.285 93.2739L181.305 93.2525Z"/><path d="M214.423 79.7619L228.14 56.1378C228.363 55.7102 228.424 55.3682 228.323 55.133C228.201 54.8978 227.979 54.7695 227.614 54.7695H216.608C216.022 54.7695 215.657 54.9619 215.475 55.3254L206.917 69.6281C205.804 71.9157 204.813 74.0964 203.903 76.2343C202.992 78.3509 202.163 80.3178 201.414 82.0922H201.151C201.272 80.8522 201.374 79.484 201.455 77.9447C201.536 76.4054 201.596 74.8874 201.637 73.3695C201.657 71.8516 201.677 70.4833 201.677 69.2647V55.8813C201.677 55.133 201.353 54.7695 200.726 54.7695H191.197C190.55 54.7695 190.246 55.133 190.246 55.8813V114.14C190.246 114.888 190.57 115.251 191.197 115.251H200.726C201.374 115.251 201.677 114.888 201.677 114.14V97.3356L206.492 89.9598L216.709 114.525C216.932 115.016 217.316 115.273 217.842 115.273H229.294C229.638 115.273 229.88 115.145 230.002 114.867C230.123 114.589 230.083 114.268 229.921 113.905L214.464 79.8474L214.423 79.7619Z"/><path d="M267.108 54.748H233.038C232.39 54.748 232.066 55.1115 232.066 55.8598V64.3473C232.066 65.0956 232.39 65.4591 233.038 65.4591H244.388V114.118C244.388 114.867 244.711 115.23 245.339 115.23H254.868C255.454 115.23 255.738 114.867 255.738 114.118V65.4591H267.088C267.735 65.4591 268.039 65.0956 268.039 64.3473V55.8598C268.039 55.1115 267.715 54.748 267.088 54.748H267.108Z"/><path d="M291.729 54C285.316 54 280.44 55.8172 277.102 59.4517C273.743 63.0862 272.084 68.431 272.084 75.5075V94.5351C272.084 101.547 273.763 106.871 277.102 110.505C280.46 114.14 285.336 115.957 291.729 115.957C298.122 115.957 303.18 114.14 306.539 110.505C309.897 106.871 311.556 101.547 311.556 94.5351V75.5075C311.556 68.431 309.877 63.0862 306.539 59.4517C303.18 55.8172 298.244 54 291.729 54ZM285.579 67.4476C286.954 65.6303 288.998 64.7324 291.729 64.7324C294.46 64.7324 296.686 65.6517 298.062 67.4476C298.466 67.982 298.79 68.5807 299.073 69.2862L293.267 71.9158C292.417 72.3006 291.871 73.1986 291.871 74.182L291.992 83.4392C291.992 83.653 291.871 83.8455 291.689 83.931L283.515 87.4585V75.9993C283.515 72.1296 284.203 69.2862 285.558 67.4689L285.579 67.4476ZM298.082 102.531C296.706 104.348 294.602 105.246 291.749 105.246C288.897 105.246 286.954 104.348 285.599 102.531C284.871 101.569 284.345 100.329 284.001 98.8109L290.96 95.8178C291.83 95.433 292.397 94.5351 292.397 93.5303L292.275 84.2944C292.275 84.0806 292.397 83.8882 292.579 83.8241L300.166 80.382V94.0647C300.166 97.8702 299.478 100.692 298.102 102.51L298.082 102.531Z"/><path d="M345.385 83.4604V83.097C348.116 81.857 350.119 80.168 351.373 78.0087C352.628 75.8494 353.255 73.1128 353.255 69.799C353.255 64.8177 351.778 61.0549 348.804 58.5322C345.83 56.0094 341.338 54.748 335.35 54.748H320.499C319.791 54.748 319.447 55.1115 319.447 55.8598V114.118C319.447 114.867 319.832 115.23 320.58 115.23H335.613C342.491 115.23 347.489 113.819 350.645 110.976C353.781 108.153 355.359 103.749 355.359 97.7845C355.359 93.8507 354.509 90.6866 352.83 88.2707C351.13 85.8763 348.662 84.2728 345.405 83.4604H345.385ZM330.878 64.7108H334.803C337.312 64.7108 339.133 65.288 340.306 66.4639C341.48 67.6397 342.046 69.457 342.046 71.9156C342.046 74.5025 341.5 76.448 340.387 77.7735C339.275 79.099 337.535 79.7618 335.147 79.7618H330.858V64.7108H330.878ZM342.026 103.215C340.711 104.562 338.668 105.246 335.876 105.246H330.899V88.8052H335.795C338.587 88.8052 340.65 89.4893 342.006 90.8362C343.341 92.1831 344.009 94.2142 344.009 96.9293C344.009 99.6445 343.361 101.847 342.046 103.215H342.026Z"/><path d="M391.94 54.748H363.109C362.462 54.748 362.158 55.1115 362.158 55.8598V114.118C362.158 114.867 362.482 115.23 363.109 115.23H391.94C392.587 115.23 392.89 114.867 392.89 114.118V105.631C392.89 104.882 392.567 104.519 391.94 104.519H373.589V89.7459H390.281C390.928 89.7459 391.231 89.3825 391.231 88.6342V80.7025C391.231 79.9542 390.908 79.5907 390.281 79.5907H373.589V65.4591H391.94C392.587 65.4591 392.89 65.0956 392.89 64.3473V55.8598C392.89 55.1115 392.567 54.748 391.94 54.748Z"/><path d="M438.958 113.84L428.033 89.6605V89.575C430.825 88.335 432.929 86.3467 434.325 83.5674C435.721 80.7881 436.429 77.2605 436.429 72.9419C436.429 66.7847 434.892 62.2095 431.837 59.2378C428.782 56.2447 423.926 54.7695 417.29 54.7695H401.914C401.266 54.7695 400.963 55.133 400.963 55.8813V114.14C400.963 114.888 401.287 115.251 401.914 115.251H411.443C412.09 115.251 412.394 114.888 412.394 114.14V91.7129H417.108L426.637 114.525C426.86 115.016 427.244 115.273 427.77 115.273H438.25C439.12 115.273 439.363 114.803 438.958 113.883V113.84ZM423.178 79.7191C421.923 81.0446 419.92 81.7074 417.189 81.7074H412.374V65.3736H417.351C420.021 65.3736 421.984 65.9936 423.198 67.2123C424.412 68.4523 425.039 70.5047 425.039 73.3909C425.039 76.2771 424.412 78.3936 423.157 79.7191H423.178Z"/><path d="M89.0274 54.8984H79.5791C78.9316 54.8984 78.6079 55.2619 78.6079 56.0102V65.246L71.6481 68.4101C70.8186 68.795 70.2724 69.6715 70.2724 70.6336L70.3938 79.7198C70.3938 79.9336 70.2724 80.1046 70.0903 80.1901L61.4513 83.9315V56.0102C61.4513 55.2619 61.1073 54.8984 60.3992 54.8984H51.0521C50.3439 54.8984 50 55.2619 50 56.0102V114.376C50 115.124 50.3439 115.487 51.0521 115.487H60.4194C61.1276 115.487 61.4715 115.124 61.4715 114.376V95.3052L69.3619 91.9059C70.2117 91.5425 70.7782 90.6446 70.7579 89.6611L70.6365 80.5963C70.6365 80.3825 70.7579 80.2115 70.9198 80.126L78.5877 76.6625V114.397C78.5877 115.145 78.9114 115.509 79.5588 115.509H89.0071C89.6545 115.509 89.9783 115.145 89.9783 114.397V56.0315C89.9783 55.2833 89.6545 54.9198 89.0071 54.9198L89.0274 54.8984Z"/><path d="M654.265 54.7695H607.347C602.977 54.7695 599.416 58.5323 599.416 63.1502V106.807C599.416 111.425 602.977 115.187 607.347 115.187H654.265C658.635 115.187 662.196 111.425 662.196 106.807V63.1502C662.196 58.5323 658.635 54.7695 654.265 54.7695ZM627.842 96.6729C628.226 96.6729 628.429 96.9081 628.429 97.3998V101.633C628.429 102.039 628.226 102.253 627.842 102.253H609.795C609.411 102.253 609.208 102.039 609.208 101.633V97.3998C609.208 95.2405 609.532 93.4019 610.179 91.8625C610.827 90.3232 611.656 88.9336 612.668 87.7364C613.68 86.5391 614.772 85.4274 615.905 84.4653C617.038 83.4819 618.131 82.5198 619.162 81.5791C620.194 80.6384 621.044 79.6336 621.671 78.5433C622.319 77.4743 622.642 76.2343 622.642 74.8447V73.9895C622.642 72.6426 622.339 71.6591 621.752 71.0819C621.165 70.5047 620.235 70.2054 618.94 70.2054C617.645 70.2054 616.674 70.6116 616.107 71.424C615.541 72.2364 615.278 73.4336 615.298 75.0157C615.298 75.4219 615.096 75.6357 614.711 75.6357H610.321C609.937 75.6357 609.734 75.4219 609.734 75.0157C609.593 71.7019 610.341 69.1578 611.98 67.4047C613.619 65.6516 616.026 64.775 619.203 64.775C622.379 64.775 624.645 65.5447 626.223 67.0626C627.801 68.5805 628.57 70.9323 628.57 74.0964C628.57 75.935 628.348 77.5384 627.882 78.9067C627.417 80.2536 626.81 81.4722 626.041 82.4984C625.272 83.546 624.423 84.4867 623.492 85.3205C622.561 86.1757 621.631 86.9881 620.7 87.7577C619.769 88.5274 618.92 89.3398 618.151 90.195C617.382 91.0501 616.775 91.9908 616.31 93.017C615.844 94.0646 615.622 95.2619 615.622 96.6729H627.822H627.842ZM649.935 99.4094C648.195 101.611 645.565 102.723 642.045 102.723C638.524 102.723 635.874 101.761 634.154 99.837C632.414 97.9129 631.565 94.9412 631.565 90.9005V76.5336C631.565 72.6854 632.455 69.7564 634.235 67.7681C636.016 65.7799 638.646 64.775 642.105 64.775C645.059 64.775 647.386 65.5019 649.065 66.9343C650.744 68.3667 651.574 70.4619 651.574 73.2198C651.574 73.6688 651.372 73.904 650.987 73.904H646.597C646.212 73.904 646.01 73.6688 646.01 73.2198C646.01 72.2364 645.666 71.4881 644.999 70.975C644.311 70.4619 643.4 70.2054 642.206 70.2054C640.608 70.2054 639.415 70.6543 638.646 71.5523C637.877 72.4502 637.492 73.9895 637.492 76.1274V81.2584C638.545 80.4888 639.637 79.8902 640.73 79.4626C642.065 78.9281 643.441 78.6715 644.816 78.6715C647.467 78.6715 649.409 79.5481 650.643 81.3226C651.898 83.0971 652.525 85.8336 652.525 89.5322C652.525 93.915 651.655 97.2074 649.935 99.4094Z"/><path d="M642.773 83.8866C641.802 83.8866 640.811 84.1218 639.799 84.5921C639.01 84.9556 638.241 85.4259 637.473 86.0245V91.1128C637.473 93.1866 637.837 94.7259 638.545 95.7521C639.253 96.7783 640.386 97.27 641.924 97.27C643.461 97.27 644.655 96.7142 645.404 95.6025C646.152 94.4907 646.537 92.759 646.537 90.4287V89.2956C646.537 87.3287 646.233 85.939 645.646 85.1052C645.06 84.2714 644.109 83.8652 642.773 83.8652V83.8866Z"/></g>`;

/* The book's grid, at a scale that suits how many stickers there are: a
   few are drawn big, a full book small enough to fit, thirty at most
   (the most a book is planned to hold). Each scale fills the paper's
   width and its height under the head, and no more. */
export const GRID_SCALES = Object.freeze([
  Object.freeze({ upTo: 8, perRow: 4, size: 190, gutter: 26 }),
  Object.freeze({ upTo: 12, perRow: 4, size: 175, gutter: 24 }),
  Object.freeze({ upTo: 15, perRow: 5, size: 150, gutter: 22 }),
  Object.freeze({ upTo: 20, perRow: 5, size: 130, gutter: 20 }),
  Object.freeze({ upTo: 30, perRow: 6, size: 106, gutter: 16 }),
]);
const GRID_MAX = GRID_SCALES[GRID_SCALES.length - 1].upTo;
export const gridScale = (count) =>
  GRID_SCALES.find((scale) => count <= scale.upTo) ||
  GRID_SCALES[GRID_SCALES.length - 1];

/* The name, the count and the grid travel as one block, centred in the
   paper between the stair (clear from 271 across the middle) and the
   bottom edge, so a book of three rows sits in the middle of the paper
   rather than under a heading pinned to the stair. The head is the name's
   baseline 60 in, the count's 48 under it, and the grid 42 under that. */
const PAPER_TOP = 290;
const PAPER_BOTTOM = 1050;
const HEAD_NAME = 60;
const HEAD_COUNT = 108;
const HEAD_HEIGHT = 150;

/* The width a line of text has between the two gutters. */
const GUTTER = 50;
const TEXT_WIDTH = CARD_SIZE - GUTTER * 2;

export const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/* Nothing measures text in a string of SVG, so the display face steps
   down by how many characters it has to carry. The steps are drawn to
   keep the longest sticker name in the catalogue inside the paper. */
const displaySize = (text) => {
  const length = String(text).length;
  if (length <= 16) return 76;
  if (length <= 24) return 64;
  if (length <= 34) return 52;
  return 42;
};

/* A rough average glyph width, as a share of the font size: enough to
   tell a line that fits from one that does not, in the condensed display
   face and in the body face alike. Erring wide is the safe direction, and
   an SVG painted into an <img> may fall back to Helvetica or Arial, which
   are wider still. */
const WIDTH_PER_CHAR = 0.55;

/* A name comes from MyMLH and is as long as somebody typed it. Past the
   point where the estimate says it would cross the paper's border, the
   line is handed a textLength and squeezed to fit: every name is drawn
   whole, and none of them runs off the card. Short lines are left alone,
   so the face keeps its natural spacing where it has the room. */
const fitWidth = (value, size) =>
  String(value).length * WIDTH_PER_CHAR * size > TEXT_WIDTH
    ? ` textLength="${TEXT_WIDTH}" lengthAdjust="spacingAndGlyphs"`
    : '';

const number = (value, what) => {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new TypeError(`${what} is a number`);
  return n;
};

/* A sticker file, dropped into the card at a place and a size. The file's
   own root tag goes (its width, height and xmlns say 200 and belong to a
   document, not to a piece of one) and this one takes its place, keeping
   the 200-unit viewBox so the drawing inside lands where it always did.

   Everything else is kept as it was found, <defs> included: a sticker
   whose ground is a gradient is nothing without it. That does mean two
   copies of the same file in one card would carry the same gradient id
   twice. The book never lists a slug twice, and the sticker card draws
   one, so it cannot happen from here. */
export const inlineSticker = (svg, { x, y, size } = {}) => {
  /* A designer's export opens with an XML prolog, a doctype or a
     generator comment before the root; none of that belongs inside a
     nested element, so it is dropped before the root is found. */
  const source = (typeof svg === 'string' ? svg : '')
    .replace(/^(\s*(<\?xml[^>]*\?>|<!DOCTYPE[^>]*>|<!--[\s\S]*?-->))+/i, '')
    .trim();
  const open = source.match(/^<svg(?=[\s/>])[\s\S]*?>/);
  const close = source.lastIndexOf('</svg>');
  if (!open || close < open[0].length)
    throw new TypeError('a sticker is an <svg> document');

  const inner = source.slice(open[0].length, close);
  return `<svg x="${number(x, 'x')}" y="${number(y, 'y')}" width="${number(size, 'size')}" height="${number(size, 'size')}" viewBox="0 0 200 200">${inner}</svg>`;
};

/* A pointy-top hexagon filling a box of `size` at (x, y): the six
   corners the site's stickers and slots are cut to. */
const hexagon = (x, y, size) =>
  [
    [0.5, 0],
    [0.933, 0.25],
    [0.933, 0.75],
    [0.5, 1],
    [0.067, 0.75],
    [0.067, 0.25],
  ]
    .map(([px, py]) => `${x + px * size},${y + py * size}`)
    .join(' ');

/* A sticker as the book shows an earned one (Album.module.css .sticker):
   lifted on a cast shadow, an ink ring, a white ring inside it, and the
   picture inside that. The rings and the shadow are the book's, scaled
   from its 72-pixel slot: 5.8 of padding, a white ring from 2.3 in, and
   a shadow thrown 2 left and 3 down. */
export const framedSticker = (svg, { x, y, size } = {}) => {
  const k = number(size, 'size') / 72;
  const left = number(x, 'x');
  const top = number(y, 'y');
  const inset = 5.8 * k;
  const ring = 2.3 * k;
  return [
    `<polygon points="${hexagon(left - 2 * k, top + 3 * k, size)}" fill="${INK}" opacity="0.35"/>`,
    `<polygon points="${hexagon(left, top, size)}" fill="${INK}"/>`,
    `<polygon points="${hexagon(left + ring, top + ring, size - ring * 2)}" fill="${WHITE}"/>`,
    inlineSticker(svg, {
      x: left + inset,
      y: top + inset,
      size: size - inset * 2,
    }),
  ].join('');
};

/* A sticker's name on its card, on one line where it fits and on two
   where it does not, rather than squeezed. The display face steps down
   from 72 until the words fit two lines at the width estimate; a name
   that will not fit two lines even at the smallest step is squeezed on
   its last line as a last resort. Returns the lines and the size. */
const LABEL_SIZES = [72, 64, 60, 52, 48];
/* The display face is condensed: its glyphs average well under half an
   em, so the body estimate would wrap names that fit with room. */
const DISPLAY_WIDTH_PER_CHAR = 0.46;
const wrapLabel = (value) => {
  const words = String(value).split(/\s+/).filter(Boolean);
  const fits = (line, size) =>
    line.length * DISPLAY_WIDTH_PER_CHAR * size <= TEXT_WIDTH;
  for (const size of LABEL_SIZES) {
    const lines = [];
    let line = '';
    for (const word of words) {
      const trial = line ? `${line} ${word}` : word;
      if (line && !fits(trial, size)) {
        lines.push(line);
        line = word;
      } else {
        line = trial;
      }
    }
    if (line) lines.push(line);
    /* One line at any size; two lines only from 60 down, so a wrapped
       name reads as a caption under the sticker, not a second headline. */
    if (
      (lines.length === 1 || (lines.length === 2 && size <= 60)) &&
      lines.every((l) => fits(l, size))
    )
      return { lines, size, squeezed: false };
  }
  const size = LABEL_SIZES[LABEL_SIZES.length - 1];
  const half = Math.ceil(words.length / 2);
  return {
    lines: [words.slice(0, half).join(' '), words.slice(half).join(' ')],
    size,
    squeezed: true,
  };
};

const text = (
  value,
  { x, y, size, family, weight = '400', fill = INK, anchor = 'start', fit },
) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}"${fit ? fitWidth(value, size) : ''}>${escapeXml(value)}</text>`;

/* The frame every card wears: the base, with the wordmark on its forest.
   The wordmark says where the card is from, so nothing else does. */
const frame = () =>
  [
    `<rect width="${CARD_SIZE}" height="${CARD_SIZE}" fill="${FOREST}"/>`,
    STAIR,
    wordmark(),
  ].join('');

const document_ = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}">${body}</svg>`;

/* One sticker, big, with its name under it and who earned it under that.
   `earnedAt` is already words by the time it gets here (lib/earnedDate);
   without one the line simply is not drawn. */
export const stickerCardSvg = ({ name, sticker, earnedAt } = {}) => {
  const { label, svg } = sticker || {};
  const middle = CARD_SIZE / 2;
  const name_ = wrapLabel(label);
  /* A two-line name takes its room from the sticker, which steps down
     from 500 to 440, and the lines under it close up to fit. */
  const two = name_.lines.length > 1;
  const size = two ? 440 : 500;
  const leading = Math.round(name_.size * 1.05);
  /* The block: the sticker, the name's cap height plus a gap, its extra
     lines, then the earned line and the date, centred on the paper the
     way the book card's block is, so the room above and below match. */
  const nameGap = 44 + Math.round(name_.size * 0.72);
  const blockHeight =
    size +
    nameGap +
    (name_.lines.length - 1) * leading +
    58 +
    (earnedAt ? 50 : 0) +
    8;
  const stickerTop =
    PAPER_TOP + Math.round((PAPER_BOTTOM - PAPER_TOP - blockHeight) / 2);
  const labelTop = stickerTop + size + nameGap;
  const labelBottom = labelTop + (name_.lines.length - 1) * leading;
  const earnedTop = labelBottom + 58;
  const dateTop = earnedTop + 50;

  const lines = [
    frame(),
    framedSticker(svg, { x: (CARD_SIZE - size) / 2, y: stickerTop, size }),
    ...name_.lines.map((line, index) =>
      text(line, {
        x: middle,
        y: labelTop + index * leading,
        size: name_.size,
        family: DISPLAY,
        weight: '700',
        anchor: 'middle',
        /* Only a name that would not wrap into two lines is squeezed,
           and only on its last line. */
        fit: name_.squeezed && index === name_.lines.length - 1,
      }),
    ),
    text(my.share.card.earnedBy(name), {
      x: middle,
      y: earnedTop,
      size: 36,
      family: BODY,
      anchor: 'middle',
      fit: true,
    }),
  ];

  if (earnedAt)
    lines.push(
      text(earnedAt, {
        x: middle,
        y: dateTop,
        size: 26,
        family: MONO,
        fill: MUTED,
        anchor: 'middle',
      }),
    );

  return document_(lines.join(''));
};

/* The whole book: the name, the count, and the stickers as a grid. Thirty
   is what fits and stays legible, so a fuller book shows its first thirty
   and says the true count above them. */
export const bookCardSvg = ({ name, stickers, earned, total } = {}) => {
  const drawn = (Array.isArray(stickers) ? stickers : []).slice(0, GRID_MAX);
  const { perRow, size, gutter } = gridScale(drawn.length);
  const rows = Math.max(1, Math.ceil(drawn.length / perRow));
  const gridHeight = rows * size + (rows - 1) * gutter;
  const blockTop =
    PAPER_TOP + (PAPER_BOTTOM - PAPER_TOP - (HEAD_HEIGHT + gridHeight)) / 2;
  const top = blockTop + HEAD_HEIGHT;
  const middle = CARD_SIZE / 2;
  /* A book that fits on one row sits centred under its name; a fuller
     book fills its rows from the left, as the book on the site does. */
  const across = rows === 1 ? drawn.length : perRow;
  const left = (CARD_SIZE - (across * size + (across - 1) * gutter)) / 2;

  const grid = drawn.map((sticker, index) =>
    framedSticker(sticker.svg, {
      x: left + (index % perRow) * (size + gutter),
      y: top + Math.floor(index / perRow) * (size + gutter),
      size,
    }),
  );

  return document_(
    [
      frame(),
      text(name, {
        x: middle,
        y: blockTop + HEAD_NAME,
        size: displaySize(name),
        family: DISPLAY,
        weight: '700',
        anchor: 'middle',
        fit: true,
      }),
      text(my.share.card.count(earned, total), {
        x: middle,
        y: blockTop + HEAD_COUNT,
        size: 36,
        family: BODY,
        fill: MUTED,
        anchor: 'middle',
      }),
      ...grid,
    ].join(''),
  );
};
