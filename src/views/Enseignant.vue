<template>
  <div class="container">
    <form class="search" v-show="addForm == false">
      <!-- <div>
        <ul class="nav">
          <li><input type="search" class="search-input" placeholder="Entrer matricule ou nom"></li>
          <li><button class="btn-menu">Tout</button></li>
          <li><button class="btn-menu">Prestation minimun</button></li>
          <li><button class="btn-menu">Prestation maximum</button></li>
          <li><button class="btn-menu">Prestation</button></li>
        </ul>
      </div> -->
    </form>
    <div class="box" v-show="addForm == false">
      <div class="add-option"><button v-on:click="addForm = true"><i class="fa-solid fa-add"></i></button></div>
      <ul class="box-content" v-for="enseignant in this.enseignants" :key="enseignant.matricule">
        <p class="photo-container"><img src="../assets/images/lecture.png" alt="photo" class="photo"></p>
        <li>
          <ul class="btn-control">
            <li><button @click="deleteEnseignant(enseignant.matricule)"><i class="fa-solid action delete"><img src="../assets/images/delete.png" class="icon-img"></i></button></li>
            <li><RouterLink :to="{ path: '/'+JSON.stringify(enseignant)+'/edit'}"><button ><i class="fa-solid action edit"><img src="../assets/images/edit.png" class="icon-img"></i></button></Routerlink></li>
          </ul>
        </li>
        <li style="padding: 4px 16px;"><b>{{ enseignant.matricule }}</b></li>
        <li style="padding: 0px 16px; line-height: 25px;"><em>{{ enseignant.nom }}</em></li>
        <div class="text-data">
          <li>Nombre d'heures: {{ enseignant.nbHeure }}</li>
          <li>Taux horaire: {{ enseignant.tauxHoraire }}</li>
          <li>Prestation: {{ enseignant.nbHeure * enseignant.tauxHoraire }}</li>
        </div>
      </ul>
    </div>
    <div v-show="addForm == false">
      <div v-show="viewController">
        <button class="btn btn-primary show-btn" @click="showMore(more = true)" v-if="more == false">Voir plus..</button>
        <button class="btn btn-primary show-btn" @click="showLess(more = false)" v-else>Voir moins..</button>
      </div>
      <h6 class="prest-totale">Prestation totale : {{ prestationTotal }}</h6>
    </div>
  </div>

  <div v-show="addForm">
    <Ajout v-on:dataFromAddForm="createEnseignant" v-on:cancelForm="addForm = false, check = false" :isDuplicate=check v-on:checkMatricule="checkMatricule" />
  </div>

  <div class="chart-container" v-show="addForm == false">
    <canvas ref="chartCanvas"></canvas>
  </div>

</template>

<script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import Ajout from './Ajout.vue'
  import getHost from "./host.js"
  Chart.register(...registerables);
  import "../styles/enseignant.css"

  export default {
    name: 'Enseignants',
    components: {
      Ajout
    },
    data() {
      return {
        viewController: false,
        more: false,
        deleted: false,
        addForm: false,
        check: false,
        enseignants: [],
        allEnseignants: [],
        prestationTotal: 0,
      };
    },
    mounted() {
      this.readEnseignant();
      this.updateEnseignant();
      this.grapheCamembert();
    },
    methods: {
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
            if(this.deleted){
              this.allEnseignants.length <= 3 ? this.viewController = false : this.viewController = true;
              this.enseignants = this.allEnseignants;
              this.deleted = false;
            }else{
              this.limitView();
            }

            this.prestationTotal = 0;
            this.allEnseignants.forEach(enseignant => {
              this.prestationTotal += (enseignant.nbHeure * enseignant.tauxHoraire);
              this.grapheCamembert();
            });
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

      // Manao lecture ny localStorage au moment ny chargement ny Enseignant.vue
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
        const minPrestation = Math.min(...prestations);
        const maxPrestation = Math.max(...prestations);
        const totalPrestation = prestations.reduce((acc, val) => acc + val, 0);

        const ctx = this.$refs.chartCanvas.getContext("2d");

        this.chartInstance = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Minimum", "Maximum", "Total"],
            datasets: [
              {
                data: [minPrestation, maxPrestation, totalPrestation],
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
