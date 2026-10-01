(function () {
  "use strict";

  function build(THREE, M) {
    var V3 = THREE.Vector3;
    function col(hex) { return new THREE.Color(hex); }
    function glsl(hex) { var c = col(hex); return "vec3(" + c.r.toFixed(4) + "," + c.g.toFixed(4) + "," + c.b.toFixed(4) + ")"; }
    function smooth(a, b, v) { var t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); }
    function paint(geo, fn) {
      var p = geo.attributes.position, c = new Float32Array(p.count * 3), v = new V3(), o = new THREE.Color();
      for (var i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v, o); c[i * 3] = o.r; c[i * 3 + 1] = o.g; c[i * 3 + 2] = o.b; }
      geo.setAttribute("color", new THREE.BufferAttribute(c, 3));
      return geo;
    }
    function shapeBody(seg, fn) {
      var g = new THREE.SphereGeometry(1, seg[0], seg[1]);
      g.rotateZ(-Math.PI / 2);
      var p = g.attributes.position, v = new V3();
      for (var i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v); p.setXYZ(i, v.x, v.y, v.z); }
      g.computeVertexNormals();
      return g;
    }
    function fin(points, depth, bevel) {
      var s = new THREE.Shape();
      s.moveTo(points[0][0], points[0][1]);
      for (var i = 1; i < points.length; i++) {
        var q = points[i];
        if (q.length === 4) s.quadraticCurveTo(q[0], q[1], q[2], q[3]); else s.lineTo(q[0], q[1]);
      }
      var g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.9, bevelSegments: 5, curveSegments: 28, steps: 1 });
      g.translate(0, 0, -depth / 2);
      g.computeVertexNormals();
      return g;
    }
    function gradFin(geo, ax, a, b, ca, cb) {
      var A = col(ca), B = col(cb);
      return paint(geo, function (v, o) { o.copy(A).lerp(B, smooth(a, b, v[ax])); });
    }
    function beadEye(r, glints) {
      var eye = new THREE.Group();
      var ball = new THREE.Group();
      var bead = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), M.mat({ color: 0x15131c, roughness: 0.12 }));
      bead.scale.set(1, 1, 0.82);
      ball.add(bead);
      (glints || [[0.32, 0.38, 0.32], [-0.3, -0.34, 0.14]]).forEach(function (g) {
        var m = new THREE.Mesh(new THREE.SphereGeometry(r * g[2], 16, 12), M.glint);
        m.position.set(r * g[0], r * g[1], r * 0.8);
        ball.add(m);
      });
      eye.add(ball);
      return { group: eye, pivot: ball, kind: "bead", range: 0.42 };
    }
    function scleraEye(r, pr) {
      var eye = new THREE.Group();
      var white = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 26), M.mat({ color: 0xf6f4ef, roughness: 0.2 }));
      white.scale.set(1, 1, 0.62);
      eye.add(white);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.98, r * 0.09, 12, 40), M.mat({ color: 0xbfd6f2, roughness: 0.3 }));
      ring.position.z = -r * 0.05;
      eye.add(ring);
      var pivot = new THREE.Group();
      var pupil = new THREE.Mesh(new THREE.SphereGeometry(pr, 30, 22), M.mat({ color: 0x15131c, roughness: 0.12 }));
      pupil.scale.set(1, 1.04, 0.5);
      pupil.position.z = r * 0.5;
      pivot.add(pupil);
      eye.add(pivot);
      [[0.3, 0.42, 0.28], [-0.28, -0.3, 0.12]].forEach(function (g) {
        var m = new THREE.Mesh(new THREE.SphereGeometry(r * g[2], 16, 12), M.glint);
        m.position.set(r * g[0], r * g[1], r * 0.72);
        eye.add(m);
      });
      return { group: eye, pivot: pivot, kind: "sclera", range: 0.5 };
    }
    function mountEye(parent, eye, pos, normal) {
      eye.group.position.copy(pos);
      eye.group.quaternion.setFromUnitVectors(new V3(0, 0, 1), normal.clone().normalize());
      eye.rest = eye.group.quaternion.clone();
      parent.add(eye.group);
      return eye;
    }

    function fish1() {
      var root = new THREE.Group(), body = new THREE.Group();
      root.add(body);
      var HX = 0.76;
      var geo = shapeBody([96, 48], function (v) {
        var x = v.x, t = smooth(0.15, -1, x);
        var hy = 0.31 * (1 - 0.66 * t), hz = 0.2 * (1 - 0.55 * t);
        if (x > 0.55) { hy *= 1 - (x - 0.55) * 0.18; }
        v.set(x * 0.74 + 0.02, v.y * hy * (v.y < 0 ? 1.04 : 1) - t * 0.02, v.z * hz);
      });
      var A = col(0x55c3ec), B = col(0x8fdcb6), Belly = col(0x9fdcf0), Top = col(0x47b4e4);
      paint(geo, function (v, o) {
        o.copy(A).lerp(B, smooth(-0.05, -0.72, v.x));
        o.lerp(v.y > 0 ? Top : Belly, Math.min(1, Math.abs(v.y) / 0.3) * 0.35);
      });
      var swimU = { uPhase: { value: 0 }, uAmp: { value: 0 }, uHead: { value: HX }, uLen: { value: 1.45 } };
      var bodyM = new THREE.Mesh(geo, M.mat({ vertexColors: true, swim: swimU }));
      body.add(bodyM);
      var dorsal = new THREE.Mesh(gradFin(fin([[-0.5, 0], [-0.42, 0.17, -0.05, 0.19], [0.36, 0.2, 0.46, 0.0], [-0.5, 0]], 0.07, 0.04), "x", 0.4, -0.5, 0xf6e24a, 0xb7df5f), M.mat({ vertexColors: true, swim: swimU }));
      dorsal.position.set(0.02, 0.2, 0);
      body.add(dorsal);
      var pelvic = new THREE.Group();
      var pm = new THREE.Mesh(gradFin(fin([[0.06, 0.02], [0.0, -0.12, -0.2, -0.16], [-0.3, -0.12, -0.24, 0.0], [0.06, 0.02]], 0.06, 0.035), "x", 0.0, -0.3, 0xf5df4c, 0xa9da66), M.mat({ vertexColors: true }));
      pelvic.add(pm);
      pelvic.position.set(-0.06, -0.24, 0);
      body.add(pelvic);
      var tail = new THREE.Group();
      var tm = new THREE.Mesh(gradFin(fin([[0.08, 0.1], [-0.12, 0.2, -0.46, 0.44], [-0.47, 0.18, -0.33, 0.0], [-0.47, -0.17, -0.45, -0.42], [-0.12, -0.19, 0.08, -0.1], [0.08, 0.1]], 0.05, 0.035), "x", 0.0, -0.45, 0x86dcc0, 0xc7e86a), M.mat({ vertexColors: true }));
      tail.add(tm);
      tm.scale.setScalar(0.84);
      tail.position.set(-0.66, -0.01, 0);
      body.add(tail);
      var eyes = [1, -1].map(function (s) {
        var p = new V3(0.6, 0.07, s * 0.115), n = new V3(0.28, 0.16, s * 1);
        return mountEye(body, beadEye(0.062), p, n);
      });
      return { root: root, body: body, swim: swimU, tail: tail, tailLen: 0.5, fins: [{ g: pelvic, axis: "x", amp: 0.25, ph: 0 }, { g: dorsal, axis: "x", amp: 0.06, ph: 1.4 }], eyes: eyes, length: 1.9, headX: HX };
    }

    function fish2() {
      var root = new THREE.Group(), body = new THREE.Group();
      root.add(body);
      var HX = 0.66;
      var geo = shapeBody([96, 56], function (v) {
        var x = v.x, t = smooth(0.0, -1, x);
        var hy = 0.47 * (1 - 0.72 * t * t), hz = 0.21 * (1 - 0.6 * t);
        if (x > 0.45) hy *= 1 - (x - 0.45) * 0.35;
        v.set(x * 0.64 + 0.02, v.y * hy + (v.y > 0 ? 0.0 : 0.02), v.z * hz);
      });
      var navy = col(0x1d2774), band = col(0x4f8ff3), blue = col(0x2c55d8), chin = col(0x7cbef4), deep = col(0x2448c4);
      paint(geo, function (v, o) {
        var faceEdge = 0.26 + v.y * 0.12;
        o.copy(blue).lerp(deep, smooth(0.1, -0.45, v.y) * 0.4);
        var bandW = smooth(faceEdge - 0.16, faceEdge - 0.08, v.x) * (1 - smooth(faceEdge - 0.02, faceEdge, v.x));
        o.lerp(band, bandW * 0.9);
        o.lerp(navy, smooth(faceEdge - 0.01, faceEdge + 0.02, v.x));
        o.lerp(chin, smooth(faceEdge - 0.05, faceEdge + 0.05, v.x) * smooth(-0.06, -0.2, v.y) * smooth(0.0, 0.18, v.x));
      });
      var swimU = { uPhase: { value: 0 }, uAmp: { value: 0 }, uHead: { value: HX }, uLen: { value: 1.25 } };
      body.add(new THREE.Mesh(geo, M.mat({ vertexColors: true, swim: swimU })));
      var lips = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), M.mat({ color: 0x1c2470 }));
      lips.scale.set(0.9, 0.6, 1.0);
      lips.position.set(0.665, -0.12, 0);
      body.add(lips);
      var dorsal = new THREE.Mesh(gradFin(fin([[-0.5, -0.02], [-0.45, 0.2, -0.1, 0.22], [0.2, 0.2, 0.36, 0.0], [-0.5, -0.02]], 0.07, 0.04), "x", 0.3, -0.45, 0xece24a, 0x86cc4a), M.mat({ vertexColors: true, swim: swimU }));
      dorsal.position.set(-0.04, 0.37, 0);
      dorsal.rotation.z = -0.08;
      body.add(dorsal);
      var anal = new THREE.Mesh(gradFin(fin([[-0.48, 0.02], [-0.42, -0.2, -0.12, -0.2], [0.08, -0.16, 0.12, 0.02], [-0.48, 0.02]], 0.06, 0.035), "y", 0.0, -0.2, 0x5f9df0, 0x9fd3fa), M.mat({ vertexColors: true, swim: swimU }));
      anal.position.set(-0.05, -0.36, 0);
      body.add(anal);
      var pelvic = new THREE.Group();
      pelvic.add(new THREE.Mesh(gradFin(fin([[0.04, 0.02], [0.02, -0.12, -0.1, -0.15], [-0.12, -0.06, -0.06, 0.0], [0.04, 0.02]], 0.05, 0.03), "y", 0.0, -0.15, 0x6aa6f2, 0xa6d6fb), M.mat({ vertexColors: true })));
      pelvic.position.set(0.26, -0.33, 0);
      body.add(pelvic);
      var pecs = [1, -1].map(function (s) {
        var g = new THREE.Group();
        var m = new THREE.Mesh(gradFin(fin([[0, 0.025], [-0.02, 0.17, -0.22, 0.13], [-0.3, 0.02, -0.22, -0.1], [-0.06, -0.09, 0, -0.025], [0, 0.025]], 0.008, 0.012), "x", 0.0, -0.28, 0xd8ea74, 0x93c8f6), M.mat({ vertexColors: true, roughness: 0.22, pattern: "float rib = smoothstep(0.6, 1.0, sin(atan(vObj.y, -vObj.x) * 26.0)); diffuseColor.rgb *= 1.0 - rib * 0.12;" }));
        g.add(m);
        g.position.set(0.3, -0.06, s * 0.17);
        g.rotation.y = s * 0.35;
        body.add(g);
        return { g: g, axis: "y", amp: 0.32, ph: s > 0 ? 0 : Math.PI, base: g.rotation.y };
      });
      var peduncle = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), M.mat({ color: 0xe6d84a }));
      peduncle.scale.set(1.3, 0.55, 0.5);
      peduncle.position.set(-0.6, 0.02, 0);
      body.add(peduncle);
      var tail = new THREE.Group();
      var tg = fin([[0.04, 0.08], [-0.1, 0.12, -0.34, 0.4], [-0.3, 0.12, -0.24, 0.0], [-0.3, -0.12, -0.34, -0.4], [-0.1, -0.12, 0.04, -0.08], [0.04, 0.08]], 0.05, 0.03);
      var tN = col(0x1e2a82), tB = col(0x78b6f6);
      paint(tg, function (v, o) { var d = Math.abs(v.y) / (0.1 + Math.max(0, -v.x) * 0.9); o.copy(tB).lerp(tN, smooth(0.35, 0.6, d)); });
      tail.add(new THREE.Mesh(tg, M.mat({ vertexColors: true })));
      tail.position.set(-0.64, 0.02, 0);
      body.add(tail);
      var eyes = [1, -1].map(function (s) {
        return mountEye(body, scleraEye(0.1, 0.07), new V3(0.44, 0.13, s * 0.14), new V3(0.32, 0.1, s));
      });
      return { root: root, body: body, swim: swimU, tail: tail, tailLen: 0.38, fins: pecs.concat([{ g: pelvic, axis: "x", amp: 0.2, ph: 0.8 }]), eyes: eyes, length: 1.75, headX: HX };
    }

    function fish3() {
      var root = new THREE.Group(), body = new THREE.Group();
      root.add(body);
      var HX = 0.6;
      var swimU = { uPhase: { value: 0 }, uAmp: { value: 0 }, uHead: { value: HX }, uLen: { value: 1.15 } };
      var geo = shapeBody([128, 72], function (v) {
        var x = v.x, t = smooth(-0.1, -1, x);
        var hy = 0.56 * (1 - 0.55 * t * t), hz = 0.16 * (1 - 0.5 * t);
        if (x > 0.35) hy *= 1 - (x - 0.35) * 0.45;
        var yy = v.y * hy;
        if (x > 0.5 && v.y < 0.2) yy -= (x - 0.5) * 0.25;
        v.set(x * 0.6, yy, v.z * hz);
      });
      body.add(new THREE.Mesh(geo, M.mat({
        color: 0xf6d21c,
        swim: swimU,
        pattern: [
          "vec3 po = vObj;",
          "float stripeX = po.x * 30.0 + sin(po.y * 9.0 + po.x * 4.0) * 0.9;",
          "float st = smoothstep(0.55, 0.95, sin(stripeX)) * smoothstep(0.32, 0.12, po.x) * smoothstep(-0.55, -0.4, po.x) * (1.0 - smoothstep(0.38, 0.5, abs(po.y)));",
          "diffuseColor.rgb = mix(diffuseColor.rgb, " + glsl(0xe2a10e) + ", st * 0.75);",
          "diffuseColor.rgb = mix(diffuseColor.rgb, " + glsl(0xc6d84a) + ", smoothstep(-0.42, -0.6, po.x) * 0.8);",
          "float pd = length((po.xy - vec2(0.42, -0.02)) * vec2(1.0, 0.72));",
          "diffuseColor.rgb = mix(diffuseColor.rgb, " + glsl(0x55b5ea) + ", (1.0 - smoothstep(0.1, 0.16, pd)));"
        ].join("\n")
      })));
      var snout = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), M.mat({ color: 0xf4cf1e }));
      snout.scale.set(1.3, 0.7, 0.75);
      snout.position.set(0.62, -0.17, 0);
      body.add(snout);
      var tail = new THREE.Group();
      tail.add(new THREE.Mesh(gradFin(fin([[0.04, 0.06], [-0.1, 0.12, -0.32, 0.34], [-0.4, 0.0, -0.32, -0.34], [-0.1, -0.12, 0.04, -0.06], [0.04, 0.06]], 0.05, 0.035), "x", -0.05, -0.36, 0xf3d523, 0xa4d43e), M.mat({ vertexColors: true })));
      tail.position.set(-0.56, 0.0, 0);
      body.add(tail);
      var pecs = [1, -1].map(function (s) {
        var g = new THREE.Group();
        g.add(new THREE.Mesh(fin([[0, 0.035], [-0.01, 0.12, -0.14, 0.08], [-0.19, -0.02, -0.1, -0.08], [0, -0.035]], 0.012, 0.016), M.mat({ color: 0xf6d424 })));
        g.position.set(0.24, -0.27, s * 0.14);
        g.rotation.y = s * 0.3;
        body.add(g);
        return { g: g, axis: "y", amp: 0.3, ph: s > 0 ? 0 : Math.PI, base: g.rotation.y };
      });
      var eyes = [1, -1].map(function (s) {
        return mountEye(body, beadEye(0.06), new V3(0.42, -0.02, s * 0.11), new V3(0.3, 0.05, s));
      });
      return { root: root, body: body, swim: swimU, tail: tail, tailLen: 0.38, fins: pecs, eyes: eyes, length: 1.45, headX: HX };
    }

    function crab() {
      var root = new THREE.Group(), body = new THREE.Group();
      root.add(body);
      var shellG = new THREE.SphereGeometry(1, 96, 56);
      (function () {
        var p = shellG.attributes.position, v = new V3();
        for (var i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i);
          var yy = v.y > 0 ? Math.pow(v.y, 0.85) * 0.42 : v.y * 0.13;
          var xz = 1 + Math.max(0, -v.y) * 0.05;
          p.setXYZ(i, v.x * 0.7 * xz, yy + 0.08, v.z * 0.52 * xz);
        }
        shellG.computeVertexNormals();
      })();
      var top = col(0x86bdf2), side = col(0x4f8ae2);
      paint(shellG, function (v, o) { o.copy(side).lerp(top, smooth(0.02, 0.48, v.y)); });
      body.add(new THREE.Mesh(shellG, M.mat({
        vertexColors: true,
        pattern: [
          "vec3 sp = vObj * 24.0;",
          "vec3 ci = floor(sp); vec3 cf = fract(sp) - 0.5;",
          "float h = fract(sin(dot(ci, vec3(12.9898, 78.233, 37.719))) * 43758.5453);",
          "float dots = (1.0 - smoothstep(0.07, 0.15, length(cf + (vec3(h, fract(h * 7.3), fract(h * 3.1)) - 0.5) * 0.45))) * step(0.5, h) * smoothstep(0.16, 0.3, vObj.y);",
          "diffuseColor.rgb = mix(diffuseColor.rgb, " + glsl(0x3d70cc) + ", dots * 0.65);"
        ].join("\n")
      })));
      var belly = new THREE.Mesh(new THREE.SphereGeometry(1, 56, 32), M.mat({
        color: 0xf2eedc,
        pattern: "float seg = smoothstep(0.86, 1.0, abs(sin(vObj.x * 4.6))) * smoothstep(-0.2, 0.5, vObj.z) * smoothstep(0.3, -0.2, vObj.y); diffuseColor.rgb = mix(diffuseColor.rgb, " + glsl(0xd8d0b4) + ", seg * 0.6);"
      }));
      belly.scale.set(0.56, 0.24, 0.44);
      belly.position.set(0, -0.02, 0.06);
      body.add(belly);
      var eyes = [-1, 1].map(function (s) {
        var sock = new THREE.Mesh(new THREE.SphereGeometry(0.13, 28, 20), M.mat({ color: 0xf2edd9 }));
        sock.position.set(s * 0.25, 0.06, 0.44);
        sock.scale.set(1.05, 0.8, 0.85);
        body.add(sock);
        return mountEye(body, beadEye(0.11, [[0.3, 0.36, 0.3], [-0.3, -0.3, 0.12]]), new V3(s * 0.25, 0.15, 0.47), new V3(s * 0.12, 0.2, 1));
      });
      function seg(len, r0, r1, c0, c1, tip) {
        var pts = [], n = 18;
        for (var i = 0; i <= n; i++) {
          var t = i / n, r = r0 + (r1 - r0) * t;
          if (tip) r *= 1 - Math.pow(t, 1.8) * 0.88;
          else r *= 1 + Math.sin(t * Math.PI) * 0.08;
          pts.push(new THREE.Vector2(Math.max(0.004, r), t * len));
        }
        if (tip) pts.push(new THREE.Vector2(0.001, len + r1 * 0.12));
        else for (var j = 1; j <= 6; j++) { var a = j / 6 * Math.PI / 2; pts.push(new THREE.Vector2(Math.max(0.002, r1 * Math.cos(a)), len + r1 * Math.sin(a))); }
        var g = new THREE.LatheGeometry(pts, 24);
        var cc0 = col(c0), cc1 = col(c1);
        paint(g, function (v, o) { o.copy(cc0).lerp(cc1, smooth(0, len, v.y)); });
        var m = new THREE.Mesh(g, M.mat({ vertexColors: true }));
        m.add(new THREE.Mesh(new THREE.SphereGeometry(r0 * 1.04, 20, 14), M.mat({ color: c0 })));
        return m;
      }
      function aim(obj, dir) { obj.quaternion.setFromUnitVectors(new V3(0, 1, 0), dir.clone().normalize()); }
      var legs = [];
      [[0.14, 0], [-0.08, 1], [-0.28, 0]].forEach(function (L, li) {
        [-1, 1].forEach(function (s) {
          var hip = new THREE.Group();
          hip.position.set(s * 0.56, -0.02, L[0]);
          body.add(hip);
          var lift = new THREE.Group();
          hip.add(lift);
          var sp = L[0] * 0.8;
          var d1 = new V3(s * 0.9, 0.42, sp), d2 = new V3(s * 0.7, -0.55, sp * 0.8), d3 = new V3(s * 0.32, -0.95, sp * 0.5);
          var s1 = seg(0.26, 0.105, 0.095, 0xa2cbf6, 0x7fb2f2, false); aim(s1, d1); lift.add(s1);
          var k1 = new THREE.Group(); k1.position.copy(d1.clone().normalize().multiplyScalar(0.26)); lift.add(k1);
          var s2 = seg(0.27, 0.095, 0.085, 0x6fa3ef, 0x4c85e4, false); aim(s2, d2); k1.add(s2);
          var k2 = new THREE.Group(); k2.position.copy(d2.clone().normalize().multiplyScalar(0.27)); k1.add(k2);
          var s3 = seg(0.36, 0.088, 0.08, 0x4a82e4, 0x2457d0, true); aim(s3, d3); k2.add(s3);
          legs.push({ hip: hip, lift: lift, side: s, idx: li, phase: ((li + (s > 0 ? 1 : 0)) % 2) * Math.PI });
        });
      });
      var claws = [-1, 1].map(function (s) {
        var shoulder = new THREE.Group();
        shoulder.position.set(s * 0.6, 0.06, 0.24);
        body.add(shoulder);
        var raise = new THREE.Group();
        shoulder.add(raise);
        var a1 = new V3(s * 0.85, 0.5, 0.2), a2 = new V3(s * 0.02, 1, 0.08);
        var u = seg(0.28, 0.125, 0.12, 0xa4ccf6, 0x86b8f3, false); aim(u, a1); raise.add(u);
        var elbow = new THREE.Group(); elbow.position.copy(a1.clone().normalize().multiplyScalar(0.28)); raise.add(elbow);
        var f = seg(0.24, 0.12, 0.125, 0x8dbdf4, 0x6aa1ee, false); aim(f, a2); elbow.add(f);
        var wrist = new THREE.Group(); wrist.position.copy(a2.clone().normalize().multiplyScalar(0.25)); elbow.add(wrist);
        var palmG = new THREE.SphereGeometry(1, 36, 26);
        var pc0 = col(0x77abf1), pc1 = col(0x3b74e0);
        paint(palmG, function (v, o) { o.copy(pc0).lerp(pc1, smooth(-0.6, 0.9, v.y)); });
        var palm = new THREE.Mesh(palmG, M.mat({ vertexColors: true }));
        palm.scale.set(0.2, 0.27, 0.18);
        palm.position.set(0, 0.2, 0);
        wrist.add(palm);
        var fixed = seg(0.38, 0.115, 0.1, 0x3d76e0, 0x2354cd, true);
        fixed.position.set(s * 0.07, 0.38, 0);
        fixed.rotation.z = -s * 0.32;
        wrist.add(fixed);
        var hinge = new THREE.Group();
        hinge.position.set(-s * 0.09, 0.37, 0.01);
        wrist.add(hinge);
        var mov = seg(0.32, 0.1, 0.085, 0x3d76e0, 0x2354cd, true);
        hinge.add(mov);
        hinge.rotation.z = s * 0.38;
        return { shoulder: shoulder, raise: raise, hinge: hinge, side: s, open: s * 0.38 };
      });
      return { root: root, body: body, legs: legs, claws: claws, eyes: eyes, ground: 0.6, width: 2.5 };
    }

    return { fish: [fish1(), fish2(), fish3()], crab: crab() };
  }

  window.TankCreatures = { build: build };
})();
