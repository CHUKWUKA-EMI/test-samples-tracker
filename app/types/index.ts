export type Patient = {
    age: number
    company: string
    city: string
    district: string
    visionDefect: string
}

export type TestTube = {
    id: string
    patient: Patient
}

export type Rack = TestTube[]

const canAssignToRack = (currentTestTube: TestTube, anyTestTube: TestTube) => {
    const patient = currentTestTube.patient
    const target = anyTestTube.patient

    if (patient.age === target.age ||
        patient.company === target.company ||
        patient.visionDefect === target.visionDefect ||
        (patient.city === target.city && patient.district===target.district)
    ) { 
        return false
    }
    
    return true
}

const fn = (testTubes: TestTube[]) => {
    const racks: Rack[] = []

    testTubes.forEach(currentTestTube => {
        const availableRack = racks.find(r => {
            r.find(t=>t.id !==currentTestTube.id && canAssignToRack(currentTestTube,t))
        })

        if (availableRack) {
            availableRack.push(currentTestTube)
        }
    })
}