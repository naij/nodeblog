KISSY.add("app/util/format/format",function(r){var e={};return r.mix(e,{formatNumber:function(r,e){e=e||",";var i=typeof r;if("number"!==i&&"string"!==i&&"function"!==i)return["--"];if("function"===i&&(r=r()),"string"===i&&/[^\d\.\-]/.test(r))return["--"];if(isNaN(r))return["--"];var t=r.toString(10),n=t.indexOf("-")>-1;n&&(t=t.slice(1));var s=t.split("."),o=s[0].split("").reverse().join(""),u=o.match(/\-?\d{3}/g)||[],a=o.length,f=o.slice(a-a%3),m=[];f&&u.push(f);for(var v=0;v<u.length;v++)u[v]=u[v].split("").reverse().join("");return m.push(n?"-"+u.reverse().join(e):u.reverse().join(e)),s[1]&&(s[1]=s[1].slice(0,2),1===s[1].length&&(s[1]=s[1]+"0"),m.push(s[1])),m.join(".")}}),e},{requires:["magix/vframe","magix/vom"]});