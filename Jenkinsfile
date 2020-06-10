pipeline {
    agent {
        docker {
            image 'node:12-alpine' 
            args '-p 4200:4200' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
        stage('Test') {
            steps {
                sh 'ng run-script test'
            }
        }    
    }
    
}