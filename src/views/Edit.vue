<template>
  <div class="container mt-5">
    <div class="card">
      <div>
        <h4>Modifier un enseignant</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="matricule">Matricule</label>
          <input required readonly type="text"  id="matricule" v-model="model.enseignant.matricule" class="form-control">
        </div>
        <div class="mb-3">
          <label for="nom">Nom</label>
          <input required type="text" @keyup="setPath()" id="nom" v-model="model.enseignant.nom" class="form-control">
        </div>
        <div class="mb-3">
          <label for="nbHeure">Nombre d'heures</label>
          <input required type="number" @keyup="setPath()" id="nbHeure" v-model="model.enseignant.nbHeure" class="form-control">
        </div>
        <div class="mb-3">
          <label for="tauxhr">Taux horaires</label>
          <input required type="number" @keyup="setPath()" id="tauxhr" v-model="model.enseignant.tauxHoraire" class="form-control">
        </div>
        <div class="mb-3 btn-control-group">
          <RouterLink :to="{ path: path}">
            <button type="button" @click="setData()" class="btn btn-primary control-btn save"
              :disabled="
                (
                  (model.enseignant.matricule.length == 0) ||
                  (model.enseignant.nom.length == 0) ||
                  (model.enseignant.nbHeure.length == 0) ||
                  (model.enseignant.nbHeure < 0) ||
                  (model.enseignant.tauxHoraire.length == 0) ||
                  (model.enseignant.tauxHoraire < 0)
                )"
            >
              Enregistrer
            </button>
          </RouterLink>
          <RouterLink :to="{ path: '/'}"><button type="button" @click="cancel" class="btn btn-primary control-btn cancel">Annuler</button></RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
  import axios from 'axios';
  import '../styles/form.css';
  
  export default {
    id: 'Enseignantcreate',
    data() {
      return {
        path: "/",

        model: {
          enseignant: {
            matricule: '',
            nom: '',
            nbHeure: null,
            tauxHoraire: null
          }
        },
        enseignants: [],
      };
    },
    mounted() {
      this.fillForm();
      // console.log(JSON.parse(this.$route.params.object).matricule);
    },
    methods: {
      fillForm() {
        this.model.enseignant = {
          matricule: JSON.parse(this.$route.params.object).matricule,
          nom: JSON.parse(this.$route.params.object).nom,
          nbHeure: JSON.parse(this.$route.params.object).nbHeure,
          tauxHoraire: JSON.parse(this.$route.params.object).tauxHoraire
        }
      },

      setData(){
        localStorage.setItem("dataUpdated", JSON.stringify(this.model.enseignant));
      },

      setPath(){
        (
          (this.model.enseignant.matricule.length == 0) ||
          (this.model.enseignant.nom.length == 0) ||
          (this.model.enseignant.nbHeure.length == 0) ||
          (this.model.enseignant.nbHeure < 0) ||
          (this.model.enseignant.tauxHoraire.length == 0) ||
          (this.model.enseignant.tauxHoraire < 0)
        ) ? this.path = "edit" : this.path = "/"; 
      }
    }
  };
</script>

<style scoped>
  .container{
    margin: 0 auto;
  }
  .card{
    margin-top: 100px;
    width: 500px;
  }
  @media screen and (max-width : 740px) {
    .card{
      width: 100%;
    }
    .control-btn{
      width: 100%;
    }
    .card{
      padding: 16px 0px;
      border: none;
    }
  }
</style>
  