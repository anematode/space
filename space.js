(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SPACE = global.SPACE || {})));
}(this, (function (exports) {
  function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  Vector3.prototype.copyFrom = function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }

  Vector3.prototype.copyTo = function(v) {
    v.x = this.x;
    v.y = this.y;
    v.z = this.z;
  }

  Vector3.prototype.addFrom = function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }

  Vector3.prototype.addTo = function(v) {
    v.x += this.x;
    v.y += this.y;
    v.z += this.z;
  }

  Vector3.prototype.magnitudeSquared = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  Vector3.prototype.magnitude = function() {
    return Math.hypot(this.x, this.y, this.z);
  }

  function Orbit(axis, ecc, incl, ascn, anomaly, peri) {
    this.axis = axis;
    this.ecc = ecc;
    this.incl = incl;
    this.ascn = ascn;
    this.anomaly = anomaly;
    this.peri = peri;
  }

  Orbit.prototype.position = function() {
    return util.positionFromOrbit(this.axis, this.ecc, this.incl, this.ascn, this.anomaly, this.peri);
  }

  function SpaceObj(name, id, parentName, getOffsetOrbit, props) {
    this.name = name;
    this.id = id;

    this.parentName = parentName;
    this.parent = null;

    this.getOffsetOrbit = getOffsetOrbit;

    this.getOrbit = function(jd, v) {
      if (this.parent) {
        if (v) {
          getOffsetOrbit(jd, v);
          this.parent.getOrbit(jd, v);
        } else {
          var netV = new Vector3(0, 0, 0);
          this.getOrbit(jd, netV);

          return netV;
        }
      } else {
        if (v) {
          v.x = 0;
          v.y = 0;
          v.z = 0;

          getOffsetOrbit(jd, v);
        } else {
          return getOffsetOrbit(jd);
        }
      }
    }

    this.props = props || {};
  }


  function loadSpaceObjFromKernel(file) {
    return;
  }

  function asyncLoadSpaceObjFromKernel(file, callback) {
    return;
  }

  var zeroVector = new Vector3(0, 0, 0);
  var ORIGIN = new SpaceObj("ORIGIN", -1, null, function() {
    return zeroVector;
  });

  var LoadedObjects = {
    ORIGIN: ORIGIN
  };


  // Utilities

  var util = {
    positionFromOrbit: function(a, e, i, W, M, w) {
      // Calculates the position of a body given its orbital parameters

      var E = M; // Eccentric anomaly

      // Newton's method: find root of M - E + e * sin(E)
      while (true) {
        var dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        E -= dE;
        if (Math.abs(dE) < 1e-9) break;
      }

      // True anomaly
      var v = Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2)) * 2;

      // Distance to center body
      var r = (a * (1 - e * e)) / (1 + e * Math.cos(v));

      // Rotate x, y, z coords relative to J2000 ecliptic
      var x = r * (Math.cos(W) * Math.cos(w + v) - Math.sin(W) * Math.sin(w + v) * Math.cos(i));
      var y = r * (Math.sin(W) * Math.cos(w + v) + Math.cos(W) * Math.sin(w + v) * Math.cos(i));
      var z = r * (Math.sin(i) * Math.sin(w + v));

      return new Vector3(-x, z, y);
    },

    getOrbit: function(obj, jd) {
      return obj.getOrbit(jd);
    }
  }

  // Exports

  exports.Vector3 = Vector3;
  exports.Orbit = Orbit;
  exports.SpaceObj = SpaceObj;
  exports.zeroVector = zeroVector;
  exports.LoadedObjects = LoadedObjects;
  exports.util = util;

})));

/**
  Vector3 = function(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  },
  positionFromOrbit = function(a, e, i, W, M, w) {
    // Calculates the position of a body given its orbital parameters

    var E = M; // Eccentric anomaly

    // Newton's method: find root of M - E + e * sin(E)
    while (true) {
      var dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-9) break;
    }

    // True anomaly
    var v = Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2)) * 2;

    // Distance to center body
    var r = (a * (1 - e * e)) / (1 + e * Math.cos(v));

    // Rotate x, y, z coords relative to J2000 ecliptic
    var x = r * (Math.cos(W) * Math.cos(w + v) - Math.sin(W) * Math.sin(w + v) * Math.cos(i));
    var y = r * (Math.sin(W) * Math.cos(w + v) + Math.cos(W) * Math.sin(w + v) * Math.cos(i));
    var z = r * (Math.sin(i) * Math.sin(w + v));

    return new THREE.Vector3(-x, z, y).multiplyScalar(149597870.7);
  }
SPACE.Vector2**/
