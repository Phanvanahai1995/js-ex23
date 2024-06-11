const phonePattern = /((0|\+84)[0-9]{9})/g;

export const patternEmail =
  /([a-zA-Z][a-zA-Z0-9-_\.]+[a-zA-Z0-9]+@([a-zA-Z]|[a-zA-Z][a-zA-Z-_0-9\.]*[a-zA-Z0-9])(\.[a-zA-Z]{2,})+)/g;

export const patternYt =
  /((?:(?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/|shorts\/)?)([\w\-]+)(\S+)?)/g;

const urlPatternHttp =
  /(https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256})\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/g;

const urlPatternNoneHttp =
  /([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;

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

  if (patternEmail.exec(html)) {
    html = html.replace(
      patternEmail,
      `<a href="mailto:$1" title="Tên miền web $2" target='_blank'>$1</a>`
    );
  }

  if (patternYt.exec(html)) {
    html = html.replace(
      patternYt,
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/$5$6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    );
  }

  return html;
}

export function convertRegexContent(blog) {
  let match;

  let url = blog.content.match(urlPatternHttp);
  let urlNonHttp = blog.content.match(urlPatternNoneHttp);

  if (url && !url[0].match(patternYt)) {
    match = blog.content.replace(
      urlPatternHttp,
      `<a href="$1" target="_blank">$1</a>`
    );

    console.log(match);
  }

  if (
    urlNonHttp &&
    !urlNonHttp[0].match(patternYt) &&
    !urlNonHttp[0].match(patternEmail)
  ) {
    match = blog.content.replace(
      urlPatternNoneHttp,
      `<a href="https://${"$1".replace("/", "")}" target="_blank">$1</a>`
    );
  }

  return match;
}

export default regex;
