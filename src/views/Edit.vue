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
          <div class="mb-3">
            <RouterLink :to="{ path: '/'}"><button type="button" @click="cancel" class="btn btn-primary control-btn cancel">Annuler</button></RouterLink>
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
        
        // XD
        
        // axios.get('http://127.0.0.1:9090/Enseignant/readEnseignant')
        //   .then(response => {
        //     this.enseignants = response.data;
        //     const enseignantfind = this.enseignants.find(enseignant => enseignant.matricule == this.$route.params.matricule);
            
        //     if (enseignantfind) {
        //       this.model.enseignant = {
        //         matricule: enseignantfind.matricule,
        //         nom: enseignantfind.nom,
        //         nbHeure: enseignantfind.nbHeure,
        //         tauxHoraire: enseignantfind.tauxHoraire
        //       }
        //     } else {
        //       console.log("Aucun enseignant trouvé avec ce matricule.");
        //     }
        //   })
        //   .catch(error => {
        //     console.error('Il y a eu une erreur lors de la récupération des enseignants:', error);
        //   });
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

      // cancel(){
      //   this.$emit("cancelForm", false);
      // }
    }
  };
</script>

<style scoped>
.card{
  margin-top: 100px;
}
</style>
  