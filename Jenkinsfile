pipeline {
  agent any
  tools {nodejs "120Node"}
  environment {
    registry = 'mario/12345'
    registryCredential = 'c5cdbbc4-9807-4b9a-a800-ec740e106ebd'
  }
  stages {
    stage('INSTALL PACKAGES') {
      steps {
        sh "npm install"
      }
    }
    stage('TEST') {
      steps {
        echo "insert your testing here"
      }
    }
    stage('BUILD APP') {
      steps {
        sh "node_modules/.bin/ng build --prod"
      }
    }
    stage("BUILD DOCKER") {
      steps {
        script {
          dockerImageBuild = docker.build registry + ":latest"
        }
      }
    }
     stage("DEPLOY DOCKER") {
       steps {
          script {
            docker.withRegistry('', registryCredential) {
              dockerImageBuild.push()
            }
         }
      }
   }
    stage("DEPLOY & ACTIVATE") {
      steps {
        echo 'this part will differ depending on setup'
      }
    }
  }
}