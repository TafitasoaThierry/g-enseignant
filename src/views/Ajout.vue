<template>
  <div class="container mt-5">
    <div class="card">
      <div>
        <h4>Ajouter un enseignant</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="matricule">Matricule</label>
          <input required type="text" id="matricule" v-model="model.enseignant.matricule" class="form-control" @keyup="checkMatricule()">
          <p style="color: red" v-show="isDuplicate == true">Matricule existe déjà</p>
        </div>
        <div class="mb-3">
          <label for="nom">Nom</label>
          <input required type="text" id="nom" v-model="model.enseignant.nom" class="form-control">
        </div>
        <div class="mb-3">
          <label for="nbHeure">Nombre d'heures</label>
          <input required type="number" id="nbHeure" v-model="model.enseignant.nbHeure" class="form-control">
        </div>
        <div class="mb-3">
          <label for="tauxHoraire">Taux horaires</label>
          <input required type="number" id="tauxHoraire" v-model="model.enseignant.tauxHoraire" class="form-control">
        </div>
        <div class="mb-3 btn-control-group">
          <button type="button" class="btn btn-primary control-btn cancel" @click="cancel">Annuler</button>
          <button type="button" @click="createEnseignant" class="btn btn-primary control-btn save" 
            :disabled="
              (
                (isDuplicate == true) ||
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
    props: {
      isDuplicate: Boolean
    },
    data() {
      return {
        model: {
          enseignant: {
            matricule: '',
            nom: '',
            nbHeure: 0,
            tauxHoraire: 0
          }
        }
      };
    },
    methods: {
      // send object to the parent(Enseignant.vue)
      createEnseignant() {
        this.$emit("dataFromAddForm", this.model.enseignant, false);
        this.clearForm();
      },

      // set addForm in parent to 'false'
      cancel() {
        this.$emit("cancelForm", false);
        this.clearForm();
      },

      // send matricule to parent and get response in props
      checkMatricule(){
        this.$emit("checkMatricule", this.model.enseignant.matricule);
      },

      clearForm(){
        this.model.enseignant.matricule = "";
        this.model.enseignant.nom = "";
        this.model.enseignant.nbHeure = 0;
        this.model.enseignant.tauxHoraire = 0;
      }
    }
  };
</script>

<style scoped>
  .card{
    margin-left: 0;
  }
</style>