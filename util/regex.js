const phonePattern = /((0|\+84|\(\+84\))[0-9]{9})/g;

const patternEmail =
  /([a-zA-Z][a-zA-Z0-9-_\.]+[a-zA-Z0-9]+@([a-zA-Z]|[a-zA-Z][a-zA-Z-_0-9\.]*[a-zA-Z0-9])(\.[a-zA-Z]{2,})+)/g;

const patternYt =
  /((?:(?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/|shorts\/)?)([\w\-]+)(\S+)?)/g;

// const linkRegex =
//   /(((https?:\/\/)?(www\.)?)?([-a-zA-Z0-9:%._\+~#=;]{1,256}\.[a-zA-Z0-9())]{1,6}\b([-a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ0-9()@:%_\+.~#?&\/\/=;]*)))/g;

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
  let url = html.match(urlPatternHttp);
  let urlNonHttp = html.match(urlPatternNoneHttp);

  if (url) {
    for (let i = 0; i < url.length; i++) {
      if (!patternYt.test(url[i]) && !url[i].includes("youtube")) {
        html = html.replace(
          url[i],
          `<a href="${url[i]}" target="_blank">${url[i]}</a>`
        );
      }
    }
  }

  if (urlNonHttp) {
    for (let i = 0; i < urlNonHttp.length; i++) {
      if (
        !patternYt.test(urlNonHttp[i]) &&
        !patternEmail.test(urlNonHttp[i]) &&
        !urlNonHttp[i].includes("youtube") &&
        !urlNonHttp[i].includes("@")
      ) {
        html = html
          .replace(
            urlNonHttp[i],
            `<a href="http://${urlNonHttp[i]}" target="_blank">${urlNonHttp[i]}</a>`
          )
          .replaceAll("/a>", "</a>")
          .replaceAll("<</a>", "</a>");
      }
    }
  }

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
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/$5$6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    );
  }

  return html;
}

export default regex;
