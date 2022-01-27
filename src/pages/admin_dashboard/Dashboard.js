/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { STOREHOUSE, CASHIER } from "../../Roles";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import LastOrders from "./modules/LastOrders";
import EarnDay from "./modules/EarnDay";
import PieChart from "./modules/PieChart";
import WeekdayBar from "./modules/WeekdayBar";

import { ApiUrl } from "../../Url";
import axios from "axios";

import { storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },

  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 150,
  },
  fixedHeight2: {
    height: 495,
  },
}));

function downloadURI(dataurl, filename) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}

function Dashboard() {
  const history = useHistory();


  useEffect(() => {
    window.localStorage.getItem("ROLE") === STOREHOUSE && history.push("/storehouse");
    window.localStorage.getItem("ROLE") === CASHIER && history.push("/cashier");
  }, []);

  const handlerLiquidation = () => {

    const current = new Date();
    current.setMonth(current.getMonth() - 1);
    const previousMonth = current.toLocaleString('default', { month: 'long' });
    const filename = `liquidación_${previousMonth}_${current.getFullYear()}`
    const starsRef = ref(storage, `liquidate/${filename}.xlsx`);

    getDownloadURL(starsRef)
      .then((url) => {
        downloadURI(url, `${filename}.xlsx`)
      })
      .catch((error) => {
        axios({
          method: "GET",
          url: `${ApiUrl}admin/liquidateContributions`,
          headers: { Authorization: `${window.localStorage.getItem("USER_KEY")}` }
        })
          .then((res) => {
            if (res.status === 200) {
              downloadURI(res.data.url, `${filename}.xlsx`)
            }
          })
          .catch((err) => {
            alert('algo ha sucedido, Comuníquese con el soporte')
          });
      });
  };

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeight2);

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <h1>Tablero De Administrador</h1>
          <Grid container spacing={3}>
            {/* WeekdayBar  */}
            <Grid item xs={6} justify="flex-start">
              <Paper className={classes.paper}>
                <WeekdayBar />
              </Paper>

              {/*  Total sell per day  */}
              <Paper
                className={fixedHeightPaper}
                style={{ paddingTop: "20px" }}
              >
                <EarnDay />
              </Paper>
            </Grid>
            {/*  pie chart  */}
            <Grid item xs={6} sm={6} md={5}>
              <Paper className={fixedHeightPaper2}>
                <PieChart />
              </Paper>
            </Grid>

            {/* Last Orders */}
            <Grid item xs={11}>
              <Paper className={classes.paper}>
                <LastOrders />
              </Paper>
            </Grid>
          </Grid>
        </Container>

      </main>
      <div> 
        <button className="btn3 btn1" onClick={() => handlerLiquidation()}>liquidación Mensual</button>
      </div>

    </div>
  );
}

export default Dashboard;
