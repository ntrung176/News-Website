const express = require("express");
const postModel = require("../models/posts.model");
const categoryModel = require("../models/category.model");
const subcategoryModel = require("../models/subcategory.model");
const router = express.Router();
const moment = require("moment");
const userModel = require("../models/user.model");
const multer = require("multer");
moment.locale("vi");

// Helper function to get user name by UID
async function getUserNameByUID(uid) {
  const user = await userModel.singleByUserID(uid);
  return user ? user.UserName : "Unknown User";
}

router.get("/", async function (req, res) {
  if (req.isAuthenticated() && req.user.Permission === 3) {
    const cate = await categoryModel.allforuser();
    const post = await postModel.all();

    for (let i = 0; i < post.length; i++) {
      post[i].Time = moment(post[i].TimePost, "YYYY-MM-DD hh:mm:ss").format(
        "hh:mmA DD/MM/YYYY"
      );
      const cat_post = await categoryModel.single(post[i].CID);
      post[i].CName = cat_post[0]?.CName || "Unknown Category";

      const subcat_post = await subcategoryModel.single2(post[i].SCID);
      if (post[i].SCID !== null) {
        post[i].SCName =
          " / " + (subcat_post[0]?.SCName || "Unknown Subcategory");
      }

      post[i].UserName = await getUserNameByUID(post[i].UID);
      post[i].Delete = post[i].xoa === 1;
      post[i].Pre = post[i].Premium === 1;
    }

    const statuses = [
      { key: "post_ChuaDuyet", status: 0 },
      { key: "post_TuChoi", status: 1 },
      { key: "post_ChoXuatBan", status: 2 },
      { key: "post_XuatBan", status: 3 },
    ];

    const statusPosts = {};

    for (const { key, status } of statuses) {
      const posts = await postModel.allByStatus(status);
      for (let i = 0; i < posts.length; i++) {
        posts[i].Time = moment(posts[i].TimePost, "YYYY-MM-DD hh:mm:ss").format(
          "hh:mmA DD/MM/YYYY"
        );
        const cat_post = await categoryModel.single(posts[i].CID);
        posts[i].CName = cat_post[0]?.CName || "Unknown Category";

        const subcat_post = await subcategoryModel.single2(posts[i].SCID);
        if (posts[i].SCID !== null) {
          posts[i].SCName =
            " / " + (subcat_post[0]?.SCName || "Unknown Subcategory");
        }

        posts[i].UserName = await getUserNameByUID(posts[i].UID);
        posts[i].Delete = posts[i].xoa === 1;
        posts[i].Pre = posts[i].Premium === 1;
      }
      statusPosts[key] = posts;
    }

    res.render("vwPosts/home", {
      post,
      list: cate,
      empty: cate.length === 0,
      ...statusPosts,
    });
  } else {
    res.redirect("/");
  }
});

router.get("/cat/:cid", async function (req, res) {
  if (req.isAuthenticated() && req.user.Permission > 1) {
    const cid = +req.params.cid || -1;

    // Lấy danh sách bài viết thuộc category ID (CID)
    const posts = await postModel.allByCategoryID(cid);
    const category = await categoryModel.singleByCID(cid);

    if (!category || !category.length) {
      return res.render("vwPosts/category", {
        empty: true,
        posts: [],
        category: null,
      });
    }

    for (let i = 0; i < posts.length; i++) {
      posts[i].Time = moment(posts[i].TimePost, "YYYY-MM-DD hh:mm:ss").format(
        "hh:mmA DD/MM/YYYY"
      );
      const subcat_post = await subcategoryModel.single2(posts[i].SCID);
      posts[i].SCName = subcat_post[0]?.SCName || "Unknown Subcategory";

      const uid_post = await getUserNameByUID(posts[i].UID);
      posts[i].UserName = uid_post;
    }

    res.render("vwPosts/category", {
      posts,
      empty: posts.length === 0,
      category: category[0],
    });
  } else {
    res.redirect("/");
  }
});

router.get("/status/:pid", async function (req, res) {
  if (req.isAuthenticated() && req.user.Permission > 1) {
    const pid = +req.params.pid || -1;
    const pst = await postModel.singleByPostID(pid);

    if (!pst.length) {
      return res.redirect("/admin/posts");
    }

    const cate_post = await categoryModel.singleByCID(pst[0].CID);
    const subcate_post = await subcategoryModel.single2(pst[0].SCID);
    const sub_post = subcate_post[0];
    const category = await categoryModel.allforuser();

    for (let i = 0; i < category.length; i++) {
      const row = await subcategoryModel.singleforuser(category[i].CID);
      category[i].subcategories = row;
      category[i].PID = pid;
      for (let j = 0; j < category[i].subcategories.length; j++) {
        category[i].subcategories[j].PID = pid;
      }
    }

    const post = pst[0];
    res.render("vwPosts/status", {
      cate_post,
      sub_post,
      category,
      post,
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
