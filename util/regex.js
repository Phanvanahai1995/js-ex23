const phonePattern = /((0|\+84)[0-9]{9})/g;

export const patternEmail =
  /([a-zA-Z][a-zA-Z0-9-_\.]+[a-zA-Z0-9]+@([a-zA-Z]|[a-zA-Z][a-zA-Z-_0-9\.]*[a-zA-Z0-9])(\.[a-zA-Z]{2,})+)/g;

export const patternYt =
  /((?:(?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/|shorts\/)?)([\w\-]+)(\S+)?)/g;

const urlPatternHttp =
  /(https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256})\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/g;

const urlPatternNoneHttp =
  /([^http][-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;

export function deleteSpace(content) {
  return content
    .replace(/ ' /g, "'")
    .replace(/ " /g, '"')
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n/g, " <br/> ")
    .trim();
}

function regex(html) {
  if (phonePattern.exec(html)) {
    html = html.replace(
      phonePattern,
      `<a href='tel:$1' class='phone-link' target="_blank">$1</a>`
    );
  }

  return html;
}

export function convertRegexContent(blog) {
  let url = blog.content.match(urlPatternHttp);
  let urlNonHttp = blog.content.match(urlPatternNoneHttp);

  if (url) {
    for (let i = 0; i < url.length; i++) {
      if (patternYt.test(url[i])) {
        blog.content = blog.content.replace(
          patternYt,
          `<iframe width="560" height="315" src="https://www.youtube.com/embed/$5$6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
        );
      } else {
        blog.content.replace(
          url[i],
          `<a href="${url[i]
            .replaceAll(/\n/g, "")
            .replaceAll(" ", "")}" target="_blank">${url[i]}</a>`
        );
      }
    }
  }

  if (urlNonHttp) {
    for (let i = 0; i < urlNonHttp.length; i++) {
      if (patternEmail.test(urlNonHttp[i])) {
        blog.content = blog.content.replace(
          patternEmail,
          `<a href="mailto:$1" title="Tên miền web $2" target='_blank'>$1</a>`
        );
      } else if (patternYt.test(urlNonHttp[i])) {
        // console.log(urlNonHttp[i]);
        blog.content.replace(
          patternYt,
          `<iframe width="560" height="315" src="https://www.youtube.com/embed/$5$6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
        );
      } else {
        blog.content = blog.content.replaceAll(
          urlNonHttp[i],
          `<a href="https://${urlNonHttp[i]
            .replaceAll(/\n/g, "")
            .replaceAll(" ", "")}" target="_blank">${urlNonHttp[i]}</a>`
        );

        console.log(urlNonHttp[i].replaceAll(" ", "").replaceAll("<br/>", ""));
      }
    }
  }

  return blog.content;
}

export default regex;

let content = `http://127.0.0.1:5500/https://%20%3Cbr/%3E%20youtube.com`;
