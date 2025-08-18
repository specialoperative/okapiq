"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { GeographicArea } from "@/services/census-api"

// Define the context type
export type CensusContextType = {
  selectedGeography: GeographicArea | null
  setSelectedGeography: React.Dispatch<React.SetStateAction<GeographicArea | null>>
  demographicData: any
  comparisonData: any[]
  addComparisonGeography: (geography: GeographicArea) => void
  removeComparisonGeography: (id: string) => void
  isLoading: boolean
  error: string | null
  selectedYear: number
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>
  availableYears: number[]
  availableGeographies: GeographicArea[]
  setAvailableGeographies: React.Dispatch<React.SetStateAction<GeographicArea[]>>
}

// Create the context
export const CensusContext = createContext<CensusContextType | undefined>(undefined)

// Hook for using the census context
export const useCensus = () => {
  const context = useContext(CensusContext)
  if (!context) {
    throw new Error("useCensus must be used within a CensusProvider")
  }
  return context
}

// Create a mock CensusProvider component
export const CensusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGeography, setSelectedGeography] = useState<GeographicArea | null>(null)
  const [demographicData, setDemographicData] = useState<any>(null)
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(2020)
  const availableYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
  const [availableGeographies, setAvailableGeographies] = useState<GeographicArea[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Mock demographic data
        const mockData = {
          geographyId: selectedGeography?.id || "00",
          geographyName: selectedGeography?.name || "USA",
          year: selectedYear,
          population: Math.floor(Math.random() * 1000000),
          medianAge: Math.floor(Math.random() * 50),
          medianIncome: Math.floor(Math.random() * 100000),
          raceDistribution: {
            white: Math.floor(Math.random() * 100),
            black: Math.floor(Math.random() * 100),
            asian: Math.floor(Math.random() * 100),
            hispanic: Math.floor(Math.random() * 100),
            other: Math.floor(Math.random() * 100),
          },
        }
        setDemographicData(mockData)
      } catch (err: any) {
        setError(err.message || "Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedGeography) {
      fetchData()
    } else {
      setDemographicData(null)
    }
  }, [selectedGeography, selectedYear])

  const addComparisonGeography = (geography: GeographicArea) => {
    setComparisonData((prevData) => {
      if (prevData.find((item) => item.geographyId === geography.id)) {
        return prevData
      }
      // Mock comparison data
      const mockComparisonData = {
        geographyId: geography?.id || "00",
        geographyName: geography?.name || "USA",
        year: selectedYear,
        population: Math.floor(Math.random() * 1000000),
        medianAge: Math.floor(Math.random() * 50),
        medianIncome: Math.floor(Math.random() * 100000),
        raceDistribution: {
          white: Math.floor(Math.random() * 100),
          black: Math.floor(Math.random() * 100),
          asian: Math.floor(Math.random() * 100),
          hispanic: Math.floor(Math.random() * 100),
          other: Math.floor(Math.random() * 100),
        },
      }
      return [...prevData, mockComparisonData]
    })
  }

  const removeComparisonGeography = (id: string) => {
    setComparisonData((prevData) => prevData.filter((item) => item.geographyId !== id))
  }

  const value: CensusContextType = {
    selectedGeography,
    setSelectedGeography,
    demographicData,
    comparisonData,
    addComparisonGeography,
    removeComparisonGeography,
    isLoading,
    error,
    selectedYear,
    setSelectedYear,
    availableYears,
    availableGeographies,
    setAvailableGeographies,
  }

  return <CensusContext.Provider value={value}>{children}</CensusContext.Provider>
}
