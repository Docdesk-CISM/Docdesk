require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import all models
const Doctor = require('../models/doctor');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/medicalRecord');
const Medication = require('../models/Medication.Model');
const PatientHistory = require('../models/patientHistory');
const PortalAdmin = require('../models/PortalAdmin.Model');
const AppointmentIncident = require('../models/MedicalIncidentModels/Appointment-IncidentModel');
const PrescriptionIncident = require('../models/MedicalIncidentModels/Prescription-IncidentModel');
const SymptomIncident = require('../models/MedicalIncidentModels/Symptom-IncidentModel');
const TestIncident = require('../models/MedicalIncidentModels/Test-IncidentModel');
const BreathingTest = require('../models/MediTestingModels/breathingTestModel');
const StepCount = require('../models/MediTestingModels/stepCountModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Medication.deleteMany({});
    await PatientHistory.deleteMany({});
    await PortalAdmin.deleteMany({});
    await AppointmentIncident.deleteMany({});
    await PrescriptionIncident.deleteMany({});
    await SymptomIncident.deleteMany({});
    await TestIncident.deleteMany({});
    await BreathingTest.deleteMany({});
    await StepCount.deleteMany({});
    console.log('Cleared existing data');

    // Create Portal Admins
    const admins = await PortalAdmin.insertMany([
      {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@docdesk.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        firstName: 'Support',
        lastName: 'Admin',
        email: 'support@docdesk.com',
        password: 'admin123',
        role: 'admin'
      }
    ]);
    console.log('Created portal admins');

    // Create Doctors
    const hashedPassword = await bcrypt.hash('password123', 10);
    const doctors = await Doctor.insertMany([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@docdesk.com',
        password: hashedPassword,
        nic: '199012345678',
        medicalId: 'MD-12345',
        medicalIdVerify: true,
        specialization: 'Cardiology',
        gender: 'Male',
        mobileNumber: '+1234567890',
        role: 'doctor'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@docdesk.com',
        password: hashedPassword,
        nic: '198509876543',
        medicalId: 'MD-12346',
        medicalIdVerify: true,
        specialization: 'Pediatrics',
        gender: 'Female',
        mobileNumber: '+1234567891',
        role: 'doctor'
      },
      {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@docdesk.com',
        password: hashedPassword,
        nic: '198801122334',
        medicalId: 'MD-12347',
        medicalIdVerify: true,
        specialization: 'Neurology',
        gender: 'Male',
        mobileNumber: '+1234567892',
        role: 'doctor'
      }
    ]);
    console.log('Created doctors');

    // Create Patients
   // ...existing code...

    // Create Patients
    const patients = await Patient.insertMany([
      {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@email.com',
        password: hashedPassword,
        nic: '199005152345',
        birthday: '1990-05-15',
        age: '34',
        gender: 'Female',
        mobileNumber: '+1234567893',
        address: '321 Patient St, Boston, MA',
        blood: 'O+',
        height: '165',
        weight: '60',
        pastWeights: [
          { weight: '62', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          { weight: '61', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }
        ],
        accessDoctors: [doctors[0]._id, doctors[1]._id],
        role: 'patient',
        patientVerification: true
      },
      {
        firstName: 'Robert',
        lastName: 'Brown',
        email: 'robert.brown@email.com',
        password: hashedPassword,
        nic: '198508229876',
        birthday: '1985-08-22',
        age: '39',
        gender: 'Male',
        mobileNumber: '+1234567895',
        address: '654 Health Rd, Miami, FL',
        blood: 'A+',
        height: '180',
        weight: '85',
        pastWeights: [
          { weight: '87', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
          { weight: '86', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        ],
        accessDoctors: [doctors[2]._id],
        role: 'patient',
        patientVerification: true
      },
      {
        firstName: 'Emma',
        lastName: 'Davis',
        email: 'emma.davis@email.com',
        password: hashedPassword,
        nic: '201003103456',
        birthday: '2010-03-10',
        age: '14',
        gender: 'Female',
        mobileNumber: '+1234567897',
        address: '987 Care Lane, Seattle, WA',
        blood: 'B+',
        height: '150',
        weight: '45',
        pastWeights: [
          { weight: '43', date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
          { weight: '44', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) }
        ],
        accessDoctors: [doctors[1]._id],
        role: 'patient',
        patientVerification: true
      }
    ]);
    console.log('Created patients');

// ...existing code...

    // Create Medications
    // ...existing code...

    // Create Medications
    const medications = await Medication.insertMany([
      {
        sDate: new Date().toISOString().split('T')[0],
        patientID: patients[0]._id.toString(),
        addedBy: doctors[0]._id.toString(),
        medicine: 'Lisinopril',
        meditype: 'Tablet',
        unit: 'mg',
        addedDate: new Date().toISOString().split('T')[0],
        pills: 1,
        days: 30,
        dayArray: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        times: 1,
        frequency: 'Once daily',
        duration: '30 days',
        baw: 'After meals',
        description: 'Used to treat high blood pressure. Take 10mg once daily in the morning.'
      },
      {
        sDate: new Date().toISOString().split('T')[0],
        patientID: patients[2]._id.toString(),
        addedBy: doctors[1]._id.toString(),
        medicine: 'Amoxicillin',
        meditype: 'Capsule',
        unit: 'mg',
        addedDate: new Date().toISOString().split('T')[0],
        pills: 1,
        days: 7,
        dayArray: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        times: 3,
        frequency: 'Three times daily',
        duration: '7 days',
        baw: 'After meals',
        description: 'Antibiotic for upper respiratory infection. Take 500mg three times daily.'
      },
      {
        sDate: new Date().toISOString().split('T')[0],
        patientID: patients[1]._id.toString(),
        addedBy: doctors[2]._id.toString(),
        medicine: 'Paracetamol',
        meditype: 'Tablet',
        unit: 'mg',
        addedDate: new Date().toISOString().split('T')[0],
        pills: 1,
        days: 5,
        dayArray: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        times: 2,
        frequency: 'Twice daily',
        duration: '5 days',
        baw: 'Before meals',
        description: 'Pain reliever and fever reducer. Take 500mg twice daily as needed.'
      }
    ]);
    console.log('Created medications');

    // Create Medical Records first (needed for incidents)
    const medicalRecords = await MedicalRecord.insertMany([
      {
        recordName: 'Hypertension Treatment Record',
        description: 'Medical record for hypertension management and monitoring',
        patientID: patients[0]._id,
        recordDate: new Date(),
        incidents: {
          testIncidents: [],
          symptomIncidents: [],
          medicationIncidents: [],
          appointmentIncidents: [],
          prescriptionIncidents: []
        }
      },
      {
        recordName: 'Pediatric Care Record',
        description: 'Regular checkup and vaccination record',
        patientID: patients[2]._id,
        recordDate: new Date(),
        incidents: {
          testIncidents: [],
          symptomIncidents: [],
          medicationIncidents: [],
          appointmentIncidents: [],
          prescriptionIncidents: []
        }
      },
      {
        recordName: 'General Health Record',
        description: 'General health monitoring and checkup record',
        patientID: patients[1]._id,
        recordDate: new Date(),
        incidents: {
          testIncidents: [],
          symptomIncidents: [],
          medicationIncidents: [],
          appointmentIncidents: [],
          prescriptionIncidents: []
        }
      }
    ]);
    console.log('Created medical records');

    // Create Patient History
    const patientHistories = await PatientHistory.insertMany([
      {
        patientId: patients[0]._id.toString(),
        recordId: medicalRecords[0]._id.toString(),
        title: 'Initial Consultation',
        date: new Date().toISOString().split('T')[0],
        description: 'Patient presented with high blood pressure symptoms. Prescribed Lisinopril.',
        doctor: doctors[0]._id.toString(),
        symptom: 'Hypertension, Headaches',
        presId: medications[0]._id.toString()
      },
      {
        patientId: patients[2]._id.toString(),
        recordId: medicalRecords[1]._id.toString(),
        title: 'Annual Checkup',
        date: new Date().toISOString().split('T')[0],
        description: 'Regular pediatric checkup. All vitals normal.',
        doctor: doctors[1]._id.toString(),
        symptom: 'None',
        presId: ''
      },
      {
        patientId: patients[1]._id.toString(),
        recordId: medicalRecords[2]._id.toString(),
        title: 'Headache Follow-up',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'Patient reports recurring headaches. Recommended rest and medication.',
        doctor: doctors[2]._id.toString(),
        symptom: 'Recurring headaches',
        presId: medications[2]._id.toString()
      }
    ]);
    console.log('Created patient histories');

    // Create Appointment Incidents
    const appointmentIncidents = await AppointmentIncident.insertMany([
      {
        recordID: medicalRecords[0]._id,
        doctorID: doctors[0]._id,
        doctorName: 'Dr. John Smith',
        appointmentDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        appointmentType: 'Follow-up',
        description: 'Blood pressure monitoring and medication review',
        addedDate: new Date()
      },
      {
        recordID: medicalRecords[1]._id,
        doctorID: doctors[1]._id,
        doctorName: 'Dr. Sarah Johnson',
        appointmentDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        appointmentType: 'Checkup',
        description: 'Annual pediatric checkup and vaccination',
        addedDate: new Date()
      }
    ]);
    console.log('Created appointment incidents');

    // Create Prescription Incidents
    const prescriptionIncidents = await PrescriptionIncident.insertMany([
      {
        recordID: medicalRecords[0]._id,
        doctorID: doctors[0]._id,
        doctorName: 'Dr. John Smith',
        PrescriptionDate: new Date(),
        description: 'Lisinopril 10mg - Take once daily in the morning with food for blood pressure management',
        link: 'https://example.com/prescription/rx001.pdf'
      },
      {
        recordID: medicalRecords[1]._id,
        doctorID: doctors[1]._id,
        doctorName: 'Dr. Sarah Johnson',
        PrescriptionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        description: 'Amoxicillin 500mg - Take three times daily after meals for 7 days',
        link: 'https://example.com/prescription/rx002.pdf'
      }
    ]);
    console.log('Created prescription incidents');

    // Create Symptom Incidents
    const symptomIncidents = await SymptomIncident.insertMany([
      {
        recordID: medicalRecords[2]._id,
        symptomDate: new Date(),
        symptomType: 'Headache',
        symptomDescription: 'Severe frontal headache with sensitivity to light',
        symptomFrequency: 'Daily',
        severity: 'Moderate',
        symptomDuration: '2-3 hours per episode',
        appetite: 'Normal',
        weight: '85kg'
      },
      {
        recordID: medicalRecords[1]._id,
        symptomDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        symptomType: 'Respiratory',
        symptomDescription: 'Mild cough with runny nose',
        symptomFrequency: 'Occasional',
        severity: 'Mild',
        symptomDuration: '3 days',
        appetite: 'Reduced',
        weight: '45kg'
      }
    ]);
    console.log('Created symptom incidents');

    // Create Test Incidents
    const testIncidents = await TestIncident.insertMany([
      {
        recordID: medicalRecords[0]._id,
        testType: 'Blood Pressure Test',
        provider: 'CardioLab Testing Center',
        description: 'Regular blood pressure monitoring and cardiovascular assessment',
        testDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        result: 'Pending',
        resultLink: ''
      },
      {
        recordID: medicalRecords[2]._id,
        testType: 'MRI Scan',
        provider: 'NeuroImaging Diagnostics',
        description: 'Brain MRI scan for recurring headache diagnosis',
        testDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        result: 'Scheduled',
        resultLink: ''
      },
      {
        recordID: medicalRecords[0]._id,
        testType: 'Blood Test',
        provider: 'General Lab Services',
        description: 'Complete blood count and lipid profile',
        testDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        result: 'Normal',
        resultLink: 'https://example.com/results/blood-test-001.pdf'
      }
    ]);
    console.log('Created test incidents');

    // Create Breathing Test Records
    const breathingTests = await BreathingTest.insertMany([
      {
        pID: patients[0]._id.toString(),
        date: new Date().toISOString().split('T')[0],
        systime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        stopwatchTime: '00:05:30'
      },
      {
        pID: patients[1]._id.toString(),
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        systime: '14:30:00',
        stopwatchTime: '00:06:15'
      },
      {
        pID: patients[2]._id.toString(),
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        systime: '10:15:00',
        stopwatchTime: '00:04:45'
      }
    ]);
    console.log('Created breathing test records');

    // Create Step Count Records
    const stepCounts = await StepCount.insertMany([
      {
        pID: patients[0]._id.toString(),
        date: new Date().toISOString().split('T')[0],
        stopwatchTime: '01:30:45',
        steps: 8500,
        distance: 6.5,
        calories: 320
      },
      {
        pID: patients[0]._id.toString(),
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stopwatchTime: '01:45:20',
        steps: 10200,
        distance: 7.8,
        calories: 380
      },
      {
        pID: patients[1]._id.toString(),
        date: new Date().toISOString().split('T')[0],
        stopwatchTime: '01:15:30',
        steps: 6200,
        distance: 4.7,
        calories: 250
      },
      {
        pID: patients[2]._id.toString(),
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stopwatchTime: '00:45:15',
        steps: 4500,
        distance: 3.2,
        calories: 180
      }
    ]);
    console.log('Created step count records');

    console.log('\n=== Database Seeding Completed Successfully! ===\n');
    console.log('Test Credentials:');
    console.log('Admin: admin@docdesk.com / admin123');
    console.log('Doctor: john.smith@docdesk.com / password123');
    console.log('Patient: alice.williams@email.com / password123');
    console.log('\nTotal records created:');
    console.log(`- Admins: ${admins.length}`);
    console.log(`- Doctors: ${doctors.length}`);
    console.log(`- Patients: ${patients.length}`);
    console.log(`- Medications: ${medications.length}`);
    console.log(`- Medical Records: ${medicalRecords.length}`);
    console.log(`- Patient Histories: ${patientHistories.length}`);
    console.log(`- Appointment Incidents: ${appointmentIncidents.length}`);
    console.log(`- Prescription Incidents: ${prescriptionIncidents.length}`);
    console.log(`- Symptom Incidents: ${symptomIncidents.length}`);
    console.log(`- Test Incidents: ${testIncidents.length}`);
    console.log(`- Breathing Tests: ${breathingTests.length}`);
    console.log(`- Step Count Records: ${stepCounts.length}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();