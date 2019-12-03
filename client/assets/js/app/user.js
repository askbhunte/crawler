'use strict';

var config = {
  apiPath: "/api/v1"
};

class Component {
  constructor(cfg) {
    this.config = cfg;
    if (!cfg.target) throw Error("Must have target property");
    this.target = cfg.target;
    this.comp = $(cfg.target);
    this.events = [];
  }

  addEvents() {
    this.events = [...this.events, ...arguments];
  }

  on(event, cb) {
    let exists = this.events.find(e => e === event);
    if (!exists) throw Error(`Event [${event}] is not registered`);
    $(this.target).on(event, cb);
  }

  trigger(event, data) {
    let exists = this.events.find(e => e === event);
    if (!exists) throw Error(`Event [${event}] is not registered`);
    $(this.target).trigger(event, data);
  }

  fire(event, data) {
    this.trigger(event, data);
  }

}

class API {
  async request(options) {
    if (typeof options == "string") options = {
      path: options
    };
    options.url = options.url || `${config.apiPath}${options.path}`;
    options.method = options.method || "GET";
    options.headers = options.headers || {};
    options.headers["content-type"] = "application/json";
    options.headers["access_token"] = Cookies.get("access_token");

    try {
      let res = await axios(options);
      return res.data;
    } catch (e) {
      if (e.response.status == 401) {
        location.href = "/login";
      } else {
        if (toastr) {
          toastr.error(e.response.data.message);
        } else {
          alert(e.response.data.message);
        }

        console.log(e.response);
      }

      return false;
    }
  }

  post(options) {
    options.method = "POST";
    return this.request(options);
  }

  delete(path) {
    let options = {
      method: "DELETE",
      path
    };
    return this.request(options);
  }

}

toastr.options = {
  positionClass: "toast-bottom-right"
};

class UserService extends API {
  add(data) {
    return this.post({
      path: `/users`,
      data
    });
  }

  get(userId) {
    return this.request(`/users/${userId}`);
  }

  list() {
    return this.request("/users?start=0&limit=25");
  }

  changeStatus(userId, is_active) {
    return this.post({
      path: `/users/${userId}/status`,
      data: {
        is_active
      }
    });
  }

}

var Service = new UserService();

class UserTable extends Component {
  constructor(cfg) {
    super(cfg);
    this.table = this.makeTable(cfg);
    this.events = ["change-user-status"];
    this.on("change-user-status", async (event, data) => {
      let checked = await this.changeUserStatus(data.userId, data.source.checked);
      data.source.checked = checked;
    });
  }

  makeTable(cfg) {
    return $(cfg.target).DataTable({
      pageLength: 25,
      processing: true,
      responsive: true,
      filter: true,
      sort: false,
      serverSide: true,
      searchDelay: 500,
      dom: "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-4'i><'col-sm-8'<'float-right p-2'p>>>",
      ajax: {
        url: `${config.apiPath}/users`,
        headers: {
          access_token: Cookies.get("access_token")
        },
        dataFilter: data => {
          let json = JSON.parse(data);
          json.recordsTotal = json.total;
          json.recordsFiltered = json.total;
          return JSON.stringify(json);
        },
        data: function (d) {
          return $.extend({}, {
            start: d.start,
            limit: d.length,
            search: d.search.value
          });
        }
      },
      columns: [{
        data: "full_name"
      }, {
        data: null,
        render: d => {
          let phone = d.comms.find(e => {
            return e.type == "phone";
          });
          return phone ? phone.address : "";
        }
      }, {
        data: null,
        render: d => {
          let email = d.comms.find(e => {
            return e.type == "email";
          });
          return email ? email.address : "";
        }
      }, {
        data: null,
        render: d => {
          return d.gender || "";
        }
      }, {
        data: null,
        render: d => {
          return d.dob || "";
        }
      }, {
        data: null,
        render: d => {
          if (d.is_active) return `<input type="checkbox" checked onclick="$('${cfg.target}').trigger('change-user-status', {source: this, userId:'${d._id}'})" />`;else return `<input type="checkbox" onclick="$('${cfg.target}').trigger('change-user-status', {source: this, userId:'${d._id}'})" />`;
        }
      }, {
        data: null,
        class: "text-center",
        render: function (data, type, full, meta) {
          return `&nbsp;&nbsp;
              <a href='/users/${data._id}' title='Edit Employee'><i class='fa fa-pencil'></i></a>&nbsp;&nbsp;`;
        }
      }]
    });
  }

  async changeUserStatus(user_id, isActive) {
    let isConfirm = await swal.fire({
      title: "Are you sure?",
      text: "You are changing status of the user.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    try {
      if (isConfirm.value) {
        await Service.changeStatus(user_id, isActive);
        return isActive;
      } else {
        return !isActive;
      }
    } catch (e) {
      console.log(e.message);
      return !isActive;
    }
  }

}

var form = $ => {
  return {
    get: form => {
      var data = {};
      $(`${form} :input`).each(function () {
        if (!this.name) return;
        let value = this.value;

        if (this.type == "checkbox") {
          value = this.checked;
        }

        if (this.type == "radio") {
          value = $(`input[name="${this.name}"]:checked`).val();
        }

        if (this.type == "select") {
          value = $(`select[name="${this.name}"]`).val();
        }

        let group = $(this).data("group");

        if (group) {
          data[group] = { ...data[group],
            ...{
              [this.name]: value
            }
          };
        } else {
          data[this.name] = value;
        }
      });
      return data;
    },
    set: (form, data, fields) => {
      if (!fields) {
        fields = [];

        for (let key in data) {
          fields.push(key);
        }
      } else {
        fields = fields.split(",");
      }

      let nested = [];
      fields.forEach(f => {
        let datatype = typeof data[f];

        if (datatype === "string" || datatype === "number" || datatype === "boolean") {
          $(`${form} input[name=${f}]:not([group])`).val(data[f]);
          $(`${form} select[name=${f}]:not([group])`).val(data[f]);
          $(`${form} textarea[name=${f}]:not([group])`).val(data[f]);
        } else if (datatype === "object") {
          if (!Array.isArray(data[f])) nested.push(f);
        }
      });
      nested.forEach(nestedf => {
        let nestedData = data[nestedf];
        let innerFields = [];

        for (let key in nestedData) {
          innerFields.push(key);
        }

        innerFields.forEach(inf => {
          let innerData = nestedData[inf];
          let innerDatatype = typeof innerData;

          if (innerDatatype === "string" || innerDatatype === "number" || innerDatatype === "boolean") {
            $(`${form} input[name=${inf}][data-group=${nestedf}]`).val(innerData);
            $(`${form} select[name=${inf}][data-group=${nestedf}]`).val(innerData);
            $(`${form} textarea[name=${inf}][data-group=${nestedf}]`).val(innerData);
          }
        });
      });
    },
    clear: form => {
      $(":input", form).not(":button, :submit, :reset").val("").prop("checked", false).prop("selected", false);
    }
  };
};

var array = {
  arrayContainsArray: (superset, subset) => {
    if (0 === subset.length || superset.length < subset.length) {
      return false;
    }

    for (var i = 0; i < subset.length; i++) {
      if (superset.indexOf(subset[i]) > -1) return true;
    }

    return false;
  }
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var js_cookie = createCommonjsModule(function (module, exports) {

  (function (factory) {
    var registeredInModuleLoader;

    {
      module.exports = factory();
      registeredInModuleLoader = true;
    }

    if (!registeredInModuleLoader) {
      var OldCookies = window.Cookies;
      var api = window.Cookies = factory();

      api.noConflict = function () {
        window.Cookies = OldCookies;
        return api;
      };
    }
  })(function () {
    function extend() {
      var i = 0;
      var result = {};

      for (; i < arguments.length; i++) {
        var attributes = arguments[i];

        for (var key in attributes) {
          result[key] = attributes[key];
        }
      }

      return result;
    }

    function decode(s) {
      return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
    }

    function init(converter) {
      function api() {}

      function set(key, value, attributes) {
        if (typeof document === 'undefined') {
          return;
        }

        attributes = extend({
          path: '/'
        }, api.defaults, attributes);

        if (typeof attributes.expires === 'number') {
          attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
        } // We're using "expires" because "max-age" is not supported by IE


        attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

        try {
          var result = JSON.stringify(value);

          if (/^[\{\[]/.test(result)) {
            value = result;
          }
        } catch (e) {}

        value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
        key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
        var stringifiedAttributes = '';

        for (var attributeName in attributes) {
          if (!attributes[attributeName]) {
            continue;
          }

          stringifiedAttributes += '; ' + attributeName;

          if (attributes[attributeName] === true) {
            continue;
          } // Considers RFC 6265 section 5.2:
          // ...
          // 3.  If the remaining unparsed-attributes contains a %x3B (";")
          //     character:
          // Consume the characters of the unparsed-attributes up to,
          // not including, the first %x3B (";") character.
          // ...


          stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }

        return document.cookie = key + '=' + value + stringifiedAttributes;
      }

      function get(key, json) {
        if (typeof document === 'undefined') {
          return;
        }

        var jar = {}; // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.

        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var i = 0;

        for (; i < cookies.length; i++) {
          var parts = cookies[i].split('=');
          var cookie = parts.slice(1).join('=');

          if (!json && cookie.charAt(0) === '"') {
            cookie = cookie.slice(1, -1);
          }

          try {
            var name = decode(parts[0]);
            cookie = (converter.read || converter)(cookie, name) || decode(cookie);

            if (json) {
              try {
                cookie = JSON.parse(cookie);
              } catch (e) {}
            }

            jar[name] = cookie;

            if (key === name) {
              break;
            }
          } catch (e) {}
        }

        return key ? jar[key] : jar;
      }

      api.set = set;

      api.get = function (key) {
        return get(key, false
        /* read as raw */
        );
      };

      api.getJSON = function (key) {
        return get(key, true
        /* read as json */
        );
      };

      api.remove = function (key, attributes) {
        set(key, '', extend(attributes, {
          expires: -1
        }));
      };

      api.defaults = {};
      api.withConverter = init;
      return api;
    }

    return init(function () {});
  });
});

var misc = {
  session: {
    getToken: () => {
      return {
        access_token: js_cookie.get("access_token")
      };
    },
    getUser: () => {
      let userStr = js_cookie.get("user");
      if (userStr) return JSON.parse(userStr);else return {};
    }
  },
  permissions: {
    list: () => {
      let permissions = js_cookie.get("permissions");
      if (permissions) return JSON.parse(permissions);else return {};
    },
    has: (perms = []) => {
      try {
        if (typeof perms == "string") perms = perms.split(",");
        let permissions = js_cookie.get("permissions");
        if (!permissions) return false;
        permissions = JSON.parse(permissions);
        return array.arrayContainsArray(permissions, perms);
      } catch (e) {
        return false;
      }
    }
  }
};

const {
  Permissions,
  Session
} = misc;
var lib = {
  Form: form,
  Array: array,
  Permissions,
  Session
};
var lib_1 = lib.Form;
var lib_3 = lib.Session;

const RSForm = lib_1($);

class UserAdd extends Component {
  constructor(cfg) {
    super(cfg);
    this.form = $(`${cfg.target} form`);
    this.events = ["generate-password", "user-added"];
    this.renderRoleSelector();
    this.on("generate-password", async (event, data) => {
      this.generatePassword();
    });
    this.form.submit(e => {
      e.preventDefault();
      this.addUser();
    });
  }

  open() {
    $(this.target).modal("show");
  }

  close() {
    $(this.target).modal("hide");
  }

  renderRoleSelector() {
    $(`${this.target} form [name=roles]`).select2({
      dropdownParent: $(`${this.target} .modal-header`),
      width: "100%",
      minimumInputLength: 2,
      placeholder: "Search for a role",
      ajax: {
        url: `${config.apiPath}/roles`,
        headers: lib_3.getToken(),
        dataType: "json",
        data: function (params) {
          var query = {
            search: params.term,
            limit: 5
          };
          return query;
        },
        processResults: data => {
          data = _.map(data.data, d => {
            d.id = d.name;
            return d;
          });
          return {
            results: data
          };
        },
        cache: true
      },
      escapeMarkup: markup => {
        return markup;
      },
      templateResult: data => {
        if (data.loading) {
          return data.text;
        }

        var markup = `<div class="row" style="max-width:98%">
            <div class="col text-left">${data.name}</div>
          </div>`;
        return markup;
      },
      templateSelection: data => {
        return data.name || data.text;
      }
    });
  }

  async addUser() {
    if (!this.comp.validate()) return;
    let data = RSForm.get(`${this.target} form`);
    let resData = await Service.add(data);
    if (!resData) return;
    this.fire("user-added", resData);
    RSForm.clear(this.form);
    this.close();
  }

  generatePassword() {
    let string_length = 8;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%#@&!";
    let randomstring = "";

    for (let i = 0; i < string_length; i++) randomstring += possible.charAt(Math.floor(Math.random() * possible.length));

    $(`${this.target} [name=password]`).val(randomstring);
  }

}

$(document).ready(function () {
  let ut = new UserTable({
    target: "#user-table"
  });
  let userAdd = new UserAdd({
    target: "#mdlUserAdd"
  });
  $("#btnUserAdd").on("click", () => {
    userAdd.open();
  });
  userAdd.on("user-added", () => {
    ut.reload();
  });
});

//# sourceMappingURL=index.js.map
