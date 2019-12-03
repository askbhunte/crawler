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

class UserEdit extends Component {
  async loadData(userId) {
    let data = await Service.get(userId);
    data.name = data.name.full;
    Form.set(this.target, data, "name,email,phone,gender,dob"); //this.currentUserRoles = data.roles;
    //this.createUserRolesTable(data.roles);
  }

}

$(document).ready(function () {
  let ut = new UserEdit({
    target: "#frmUser"
  });
  ut.loadData(userId);
});

//# sourceMappingURL=details.js.map
