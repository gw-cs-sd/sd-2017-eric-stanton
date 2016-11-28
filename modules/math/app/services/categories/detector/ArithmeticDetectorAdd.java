package services.categories.detector;

import java.math.BigInteger;
import java.util.List;

import beans.math.MathBean;
import services.equation.Operators;

public class ArithmeticDetectorAdd extends CategoryDetector {
	@Override
	public boolean isCategory(MathBean mathBean) {
		return containsOnlyAddition(mathBean);
	}
}
