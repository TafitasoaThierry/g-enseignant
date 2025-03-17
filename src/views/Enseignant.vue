<template>
  <div>
    <div class="container">
      <div class="search" v-show="addForm == false">
        <div class="option" v-show="addForm == false">
          <button v-on:click="addForm = true; viewController = false"><i class="fa-solid fa-add"></i></button>
        </div>
        <em style="padding: 8px 0px">Rechercher par</em>
        <input type="text" class="form-control search-input" placeholder="Nom ou Matricule" v-model="search" @keyup="research()">
        <button @click="readEnseignant()" v-show="search.length > 0" class="reset"><i class="fas">X</i></button>
      </div>
      
      <table class="table-info" v-show="addForm == false">
        <tr>
          <th colspan="2" style="padding: 16px 26px;">Nom</th>
          <th>Nombre d'heures</th>
          <th>Taux horaire</th>
          <th>Prestation</th>
          <th colspan="2" style="padding: 16px 26px;">Actions</th>
        </tr>
        <tr v-for="enseignant in this.enseignants" :key="enseignant.matricule">
          <td style="width: 60px">
            <p class="first-char">{{ enseignant.nom[0] }}</p>
          </td>
          <td style="padding-left: 0px">
            <p>
              <em>{{ enseignant.nom }}</em><br>
              <b>Matricule: {{ enseignant.matricule }}</b>
            </p>
          </td>
          <td>{{ enseignant.nbHeure }}</td>
          <td>{{ enseignant.tauxHoraire }}</td>
          <td>{{ enseignant.nbHeure * enseignant.tauxHoraire }}</td>
          <td style="padding-right: 0px"><button @click="deleteEnseignant(enseignant.matricule)"><i class="fa-solid action delete"><img src="../assets/images/delete.png" class="icon-img"></i></button></td>
          <td style="padding-left: 0px"><RouterLink :to="{ path: '/'+JSON.stringify(enseignant)+'/edit'}"><button ><i class="fa-solid action edit"><img src="../assets/images/edit.png" class="icon-img"></i></button></Routerlink></td>
        </tr>
      </table>

      <h3 style="text-align: center;" v-show="notFound && search.length > 0">Enseignant introuvable</h3>

      <div v-show="viewController">
        <button class="btn btn-primary show-btn" @click="showMore(more = true)" v-if="more == false">Voir tout</button>
        <button class="btn btn-primary show-btn" @click="showLess(more = false)" v-else>Voir moins</button>
      </div>

    </div>

    <div v-show="addForm">
      <Ajout v-on:dataFromAddForm="createEnseignant" v-on:cancelForm="limitView(addForm = false, check = false, more = false)" :isDuplicate=check v-on:checkMatricule="checkMatricule" />
    </div>

    <div class="chart" v-show="addForm == false">
      <div class="prest">
        <p class="prest-totale">Prestation totale : {{ prestationTotal }}</p>
        <p class="prest-min">Prestation minimum : {{ minPrestation }}</p>
        <p class="prest-max">Prestation maximum : {{ maxPrestation }}</p>
      </div>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  import "../styles/enseignant.css"
  import Ajout from './Ajout.vue'
  import getHost from "./host.js"

  export default {
    name: 'Enseignants',
    components: {
      Ajout
    },
    data() {
      return {
        search: "",
        notFound: true,
        viewController: false,
        more: false,
        deleted: false,
        addForm: false,
        check: false,
        enseignants: [],
        allEnseignants: [],
        prestationTotal: 0,
        minPrestation: 0,
        maxPrestation: 0
      };
    },
    mounted() {
      this.readEnseignant();
      this.updateEnseignant();
      this.grapheCamembert();
    },
    methods: {
      research(){
        if(this.search.length > 0){
          let pattern = new RegExp(this.search, "i");
          this.enseignants = [];

          this.allEnseignants.forEach((enseignant) => {
            if((enseignant.nom.search(pattern) >= 0) || (enseignant.matricule.search(pattern) >= 0)){
              this.enseignants.push(enseignant);
              this.notFound = false;
              this.viewController = false;
            }
          })

          if(this.enseignants.length == 0){
            this.notFound = true;
          }

        }else{
          this.more = false;
          this.readEnseignant();
        }
      },

      showMore(){
          this.enseignants = this.allEnseignants;
          this.more = true;
      },

      showLess(){
          this.limitView();
          this.more = false;
      },

      limitView(){
        if(this.allEnseignants.length <= 3){
          this.enseignants = this.allEnseignants;
          this.viewController = false;
        }else{
          this.enseignants = [];
          this.viewController = true;
          for(let i = 0; i < 3; i++){
            this.enseignants.push(this.allEnseignants[i]);
          }
        }
      },

      checkMatricule(matricule){
        const isDuplicate = this.enseignants.find(enseignants => enseignants.matricule == matricule);
        isDuplicate ? this.check = true : this.check = false;
      },

      createEnseignant(enseignant, addForm) {
        this.addForm = addForm;
        this.more = false;
        axios.post(getHost() + 'Enseignant/createEnseignant', enseignant) 
          .then(response => {
            this.readEnseignant();
          })
          .catch(error => {
            console.error('Il y a eu une erreur lors de la création', error);
          });
      },

      readEnseignant() {
        axios.get(getHost() + 'Enseignant/readEnseignant') 
          .then(response => {
            this.allEnseignants = response.data.reverse();
            this.search = "";
            this.allEnseignants.length <= 3 ? this.viewController = false : this.viewController = true;

            if(this.deleted){
              this.more == true ? this.enseignants = this.allEnseignants : this.limitView();
              this.deleted = false;
            }else{
              this.limitView();
            }

            this.prestationTotal = 0;
            this.maxPrestation = 0;
            this.minPrestation = 0;
            this.allEnseignants.forEach(enseignant => {
              this.prestationTotal += (enseignant.nbHeure * enseignant.tauxHoraire);
            });
            this.allEnseignants.length == 0 ? this.chartInstance.destroy() : this.grapheCamembert();
          })
          .catch(error => {
            console.error('Il y a eu une erreur lors de la récupération des enseignants:', error);
          });
      },

      deleteEnseignant(matricule) {
        if(confirm("Voulez vous vraiment supprimer?" + matricule)) {
          axios.delete(getHost() + 'Enseignant/deleteEnseignant/' + matricule) 
          .then(response => {
            this.deleted = true;
            this.readEnseignant();
          })
          .catch(error => {
            console.error('Il y a eu une erreur lors de la récupération des enseignants:', error);
          });
        }
      },

      // read localStorage
      updateEnseignant() {
        if(JSON.parse(localStorage.getItem("dataUpdated")) != null) {
          axios.put(getHost() + 'Enseignant/updateEnseignant/'+JSON.parse(localStorage.getItem("dataUpdated")).matricule, JSON.parse(localStorage.getItem("dataUpdated"))) 
          .then(response => {
            this.readEnseignant();
            localStorage.removeItem("dataUpdated");
          })
          .catch(error => {
            console.error('Il y a eu une erreur lors de la création', error);
          });
        }
      },

      grapheCamembert() {
        if (this.allEnseignants.length === 0) return;
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        // Calcul du minimum, maximum et total
        const prestations = this.allEnseignants.map(e => e.nbHeure * e.tauxHoraire);
        this.minPrestation = Math.min(...prestations);
        this.maxPrestation = Math.max(...prestations);
        const totalPrestation = prestations.reduce((acc, val) => acc + val, 0);

        const ctx = this.$refs.chartCanvas.getContext("2d");

        this.chartInstance = new Chart(ctx, {
          type: "pie",
          data: {
            // labels: ["Minimum", "Maximum", "Totale"],
            datasets: [
              {
                data: [this.minPrestation, this.maxPrestation, totalPrestation],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        });
      },
    },
  }

</script>
