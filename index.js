const express = require("express");
const app = express();
const aws = require("aws-sdk");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
const dynamoDB = new aws.DynamoDB.DocumentClient({
  region: "ap-southeast-1",
  accessKeyId: "",
  secretAccessKey: "",
});
app.listen(3000, (err)=>{
  if(err)
    console.log("loi " + err);
  else
    console.log("connect success");
})

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  let params = {
    TableName: "LinhKien",
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.render("index", {
        dataLK: data.Items,
      });
    }
  });
});

app.post("/add", (req, res) => {
  const { ten, dvt, gia, tskt } = req.body;
  let lk = {
    maLinhKien: Math.ceil(Math.random() * 10000),
    tenLinhKien: ten,
    dvTinh: dvt,
    gia: gia,
    thongsoKT: tskt,
  };
  let params = {
    TableName: "LinhKien",
    Item: lk,
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/delete", (req, res) => {
  const { madelete } = req.body;
  let params = {
    TableName: "LinhKien",
    Key: {
      maLinhKien: parseInt(madelete),
    },
  };
  dynamoDB.delete(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/update", (req, res) => {
  const { ma, ten, gia, dvt, tskt } = req.body;

  let lk = {
    ma: ma,
    ten: ten,
    gia: gia,
    dvt: dvt,
    tskt: tskt,
  };


  if (ma) {
    return res.render("update", {
      data: lk,
    });
  }

  const { maup, tenup, dvtup, giaup, tsktup } = req.body;

  let params = {
    TableName: "LinhKien",
    Key: {
      maLinhKien: parseInt(maup),
    },
    UpdateExpression:
      "set #tenLinhKien=:ten ,#dvTinh=:dvt ,#gia=:gia ,#thongsoKT=:tskt ",
    ExpressionAttributeNames: {
      "#tenLinhKien": "tenLinhKien",
      "#dvTinh": "dvTinh",
      "#gia": "gia",
      "#thongsoKT": "tskt",
    },
    ExpressionAttributeValues: {
      ":ten": tenup,
      ":dvt": dvtup,
      ":gia": giaup,
      ":tskt": tsktup,
    },
    ReturnValues: "UPDATED_NEW",
  };

  dynamoDB.update(params, (err, data) => {
    if (err) throw err;
    res.redirect("/");
  });
});
app.post("/addAPI", (req, res) => {
  const { ten, dvt, gia, tskt } = req.body;
  let lk = {
    maLinhKien: Math.ceil(Math.random() * 10000),
    tenLinhKien: ten,
    dvTinh: dvt,
    gia: gia,
    thongsoKT: tskt,
  };
  let params = {
    TableName: "LinhKien",
    Item: lk,
  };
  console.log(params);
  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      return res.json({ msg: true });
    }
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Start ${PORT}`));
